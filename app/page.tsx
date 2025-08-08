'use client';

import { useState } from 'react';
import ResultsTable from '@/components/ResultsTable';
import UploadHint from '@/components/UploadHint';

export default function Page() {
  const [jd, setJd] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setRows([]);
    try {
      const fd = new FormData();
      fd.set('jobDescription', jd);
      fd.set('intakeNotes', notes);
      if (files) Array.from(files).forEach(f => fd.append('files', f));

      const res = await fetch('/api/score', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setRows(data.results);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Resume Ranker</h1>
      <p className="text-gray-600 mt-1">Paste JD and intake notes, upload up to 10 resumes, and get a call order.</p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <textarea value={jd} onChange={e => setJd(e.target.value)} required rows={8} className="w-full p-3 border rounded-md bg-white" placeholder="Paste the JD here" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Intake Call Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} required rows={6} className="w-full p-3 border rounded-md bg-white" placeholder="Paste notes here" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Resumes (PDF, DOCX, TXT)
            <span className="ml-2 text-gray-500 font-normal">max 10</span>
          </label>
          <input type="file" accept=".pdf,.docx,.txt" multiple onChange={e => setFiles(e.target.files)} className="block w-full" />
          <UploadHint />
        </div>
        <div className="flex items-center gap-3">
          <button disabled={busy} type="submit" className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-50">{busy ? 'Scoring…' : 'Score resumes'}</button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
      </form>

      {rows.length > 0 && <ResultsTable rows={rows} />}
    </main>
  );
}
