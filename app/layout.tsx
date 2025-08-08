import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume Ranker',
  description: 'Rank resumes against a JD + intake notes'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
