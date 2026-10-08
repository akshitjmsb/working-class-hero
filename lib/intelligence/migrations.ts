// Additive migration: existing event IDs, payloads and fingerprints are preserved.
export const RESILIENCE_DDL = [
  `CREATE TABLE IF NOT EXISTS wch_turns (request_id text PRIMARY KEY, investigation_id text NOT NULL REFERENCES wch_investigations(id), fingerprint text NOT NULL, event_ids text[] NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE INDEX IF NOT EXISTS wch_events_correction ON wch_events((payload->>'supersedesRequestId')) WHERE payload ? 'supersedesRequestId'`,
  `CREATE INDEX IF NOT EXISTS wch_events_search ON wch_events USING gin(to_tsvector('simple',coalesce(payload->>'text',payload->>'claim',payload->>'content','')))`,
  String.raw`CREATE OR REPLACE FUNCTION wch_append_event(p_investigation text,p_request text,p_kind text,p_payload jsonb,p_fingerprint text) RETURNS jsonb LANGUAGE plpgsql AS $$
 DECLARE prior wch_events%ROWTYPE; saved wch_events%ROWTYPE; source_count integer;
 BEGIN
   -- Serialize writes per investigation, including competing corrections and turn batches.
   PERFORM id FROM wch_investigations WHERE id=p_investigation FOR UPDATE;
   IF NOT FOUND THEN RAISE EXCEPTION 'Investigation not found. Start it first.' USING ERRCODE='P0404'; END IF;
   SELECT * INTO prior FROM wch_events WHERE request_id=p_request;
   IF FOUND THEN
     IF prior.fingerprint<>p_fingerprint THEN RAISE EXCEPTION 'Request ID belongs to different content.' USING ERRCODE='P0409'; END IF;
     RETURN jsonb_build_object('saved',true,'repeated',true,'event',to_jsonb(prior)-'fingerprint');
   END IF;
   IF p_payload ? 'supersedesRequestId' THEN
     SELECT * INTO prior FROM wch_events WHERE request_id=p_payload->>'supersedesRequestId';
     IF NOT FOUND OR prior.investigation_id<>p_investigation OR prior.kind<>p_kind THEN
       RAISE EXCEPTION 'Correction must refer to an existing record of the same kind in this investigation.' USING ERRCODE='P0400';
     END IF;
     IF EXISTS(SELECT 1 FROM wch_events WHERE payload->>'supersedesRequestId'=prior.request_id) THEN
       RAISE EXCEPTION 'Record has already been corrected. Recall current context and correct its latest version.' USING ERRCODE='P0409';
     END IF;
   END IF;
   IF p_payload ? 'sourceRequestIds' THEN
     SELECT count(DISTINCT value) INTO source_count FROM jsonb_array_elements_text(p_payload->'sourceRequestIds');
     IF source_count<>(SELECT count(*) FROM wch_events WHERE investigation_id=p_investigation AND request_id IN (SELECT jsonb_array_elements_text(p_payload->'sourceRequestIds'))) THEN
       RAISE EXCEPTION 'Output sources must refer to saved records in this investigation.' USING ERRCODE='P0400';
     END IF;
   END IF;
   INSERT INTO wch_events(request_id,investigation_id,kind,payload,fingerprint) VALUES(p_request,p_investigation,p_kind,p_payload,p_fingerprint)
     ON CONFLICT(request_id) DO NOTHING RETURNING * INTO saved;
   IF NOT FOUND THEN
     SELECT * INTO prior FROM wch_events WHERE request_id=p_request;
     IF prior.fingerprint<>p_fingerprint THEN RAISE EXCEPTION 'Request ID belongs to different content.' USING ERRCODE='P0409'; END IF;
     RETURN jsonb_build_object('saved',true,'repeated',true,'event',to_jsonb(prior)-'fingerprint');
   END IF;
   RETURN jsonb_build_object('saved',true,'repeated',false,'event',to_jsonb(saved)-'fingerprint');
 END $$`,
  String.raw`CREATE OR REPLACE FUNCTION wch_save_turn(p_investigation text,p_request text,p_events jsonb,p_fingerprint text) RETURNS jsonb LANGUAGE plpgsql AS $$
 DECLARE prior wch_turns%ROWTYPE; item jsonb; keys text[]; saved_key text;
 BEGIN
   PERFORM id FROM wch_investigations WHERE id=p_investigation FOR UPDATE;
   IF NOT FOUND THEN RAISE EXCEPTION 'Investigation not found. Start it first.' USING ERRCODE='P0404'; END IF;
   SELECT * INTO prior FROM wch_turns WHERE request_id=p_request;
   IF FOUND THEN
     IF prior.fingerprint<>p_fingerprint THEN RAISE EXCEPTION 'Turn request ID belongs to different content.' USING ERRCODE='P0409'; END IF;
     RETURN jsonb_build_object('saved',true,'repeated',true,'requestId',p_request,'eventIds',prior.event_ids);
   END IF;
   SELECT array_agg(value->>'requestId') INTO keys FROM jsonb_array_elements(p_events);
   IF cardinality(keys)<>(SELECT count(DISTINCT k) FROM unnest(keys) k) THEN RAISE EXCEPTION 'A turn must have unique event IDs.' USING ERRCODE='P0400'; END IF;
   FOR item IN SELECT * FROM jsonb_array_elements(p_events) LOOP
     PERFORM wch_append_event(p_investigation,item->>'requestId',item->>'kind',item->'payload',item->>'fingerprint');
   END LOOP;
   INSERT INTO wch_turns(request_id,investigation_id,fingerprint,event_ids) VALUES(p_request,p_investigation,p_fingerprint,keys)
     ON CONFLICT(request_id) DO NOTHING RETURNING request_id INTO saved_key;
   IF saved_key IS NULL THEN
     SELECT * INTO prior FROM wch_turns WHERE request_id=p_request;
     IF prior.fingerprint<>p_fingerprint THEN RAISE EXCEPTION 'Turn request ID belongs to different content.' USING ERRCODE='P0409'; END IF;
   END IF;
   RETURN jsonb_build_object('saved',true,'repeated',saved_key IS NULL,'requestId',p_request,'eventIds',keys);
 END $$`,
];
