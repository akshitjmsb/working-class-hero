import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy | Working Class Hero',
  description: 'How Working Class Hero uses career workspace and connected Google account information.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-slate-100">
      <Link href="/" className="text-cyan-300 underline">Working Class Hero</Link>
      <h1 className="mt-8 text-3xl font-semibold">Privacy</h1>
      <p className="mt-4 text-slate-300">Updated October 8, 2026. Working Class Hero is a personal career workspace for industry maps, company research, job matching and resume workflows.</p>
      <h2 className="mt-8 text-xl font-semibold">Workspace information</h2>
      <p className="mt-3 text-slate-300">The application uses public company and job information, together with career information entered or connected by the workspace owner. Workspace records may include job applications, recruiter contacts, notes and resume-derived profile information.</p>
      <h2 className="mt-8 text-xl font-semibold">Connected Google account</h2>
      <p className="mt-3 text-slate-300">Resume synchronization uses Google sign-in to identify the configured owner and file-scoped Google Drive permission to access the resume file authorized for this application. It reads the PDF to maintain resume-derived matching information. It does not request access to every file in Google Drive.</p>
      <h2 className="mt-8 text-xl font-semibold">Storage and services</h2>
      <p className="mt-3 text-slate-300">Connected account metadata, authorized file metadata, synchronization records and derived profile information are stored in the application database. The Google refresh token used for background synchronization is encrypted before storage. Google provides sign-in and Drive services; Vercel hosts the application.</p>
      <h2 className="mt-8 text-xl font-semibold">Control and contact</h2>
      <p className="mt-3 text-slate-300">You can revoke the application’s Google access through your Google Account’s third-party connections settings. Revoking Google access does not automatically remove existing workspace records. For questions or requests to remove stored workspace information, contact the owner at <a href="mailto:akshitgupta.jmsb@gmail.com" className="text-cyan-300 underline">akshitgupta.jmsb@gmail.com</a>.</p>
    </main>
  );
}
