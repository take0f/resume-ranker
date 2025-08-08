'use client';

import { useMemo } from 'react';

type Row = {
  filename: string;
  score: number;
  matchedKeywords: string[];
  preview: string;
};

export default function ResultsTable({ rows }: { rows: Row[] }) {
  const csv = useMemo(() => {
    const head = 'Rank,File,Score,Matched Keywords,Preview';
    const body = rows
      .map((r, i) => [
        i + 1,
        r.filename.replaceAll(',', ' '),
        r.score.toFixed(4),
        '"' + r.matchedKeywords.join(' ') + '"',
        '"' + r.preview.replaceAll('"', '""').slice(0, 200) + '"'
      ].join(','))
      .join('\n');
    return head + '\n' + body;
  }, [rows]);

  function downloadCSV() {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ranked_call_list.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ranked call list</h2>
        <button onClick={downloadCSV} className="px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 text-sm">Download CSV</button>
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full bg-white border rounded-md">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="p-2 border-b">#</th>
              <th className="p-2 border-b">File</th>
              <th className="p-2 border-b">Score</th>
              <th className="p-2 border-b">Matched keywords</th>
              <th className="p-2 border-b">Preview</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((r, i) => (
              <tr key={r.filename} className="align-top">
                <td className="p-2 border-b">{i + 1}</td>
                <td className="p-2 border-b">{r.filename}</td>
                <td className="p-2 border-b">{r.score.toFixed(4)}</td>
                <td className="p-2 border-b max-w-[340px]">{r.matchedKeywords.join(' ')}</td>
                <td className="p-2 border-b max-w-[420px] whitespace-pre-wrap">{r.preview.slice(0, 220)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
