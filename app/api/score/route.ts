import { NextRequest, NextResponse } from 'next/server';
import { scoreDocs } from '@/lib/scoring';
import { norm } from '@/lib/text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';

async function readPDF(buf: Buffer) {
  // Lazy import to avoid bundling issues during build
  const mod = await import('pdf-parse');
  const pdf: any = (mod as any).default || mod;
  const data = await pdf(buf);
  return String(data.text || '');
}

async function readDOCX(ab: ArrayBuffer) {
  // Lazy import to avoid bundling issues during build
  const mod = await import('mammoth');
  const mammoth: any = (mod as any).default || mod;
  const res = await mammoth.extractRawText({ arrayBuffer: ab });
  return String(res.value || '');
}

async function readTXT(ab: ArrayBuffer) {
  return new TextDecoder().decode(ab);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const jd = String(form.get('jobDescription') || '');
    const notes = String(form.get('intakeNotes') || '');
    const files = form.getAll('files') as File[];

    if (!jd.trim() || !notes.trim()) {
      return NextResponse.json({ error: 'Please provide both JD and Intake Notes.' }, { status: 400 });
    }

    if (!files.length) {
      return NextResponse.json({ error: 'Please upload at least one resume.' }, { status: 400 });
    }

    if (files.length > 10) {
      return NextResponse.json({ error: 'Max 10 files.' }, { status: 400 });
    }

    const docs = [] as { id: string; text: string; name: string; preview: string }[];

    for (const f of files) {
      const ab = await f.arrayBuffer();
      const name = f.name || 'resume';
      const lower = name.toLowerCase();

      let text = '';
      if (lower.endsWith('.pdf')) {
        text = await readPDF(Buffer.from(ab));
      } else if (lower.endsWith('.docx')) {
        text = await readDOCX(ab);
      } else if (lower.endsWith('.txt')) {
        text = await readTXT(ab);
      } else {
        // Unknown type. Try as text.
        text = await readTXT(ab);
      }

      const clean = norm(text);
      docs.push({ id: name, text: clean, name, preview: text.slice(0, 400) });
    }

    const query = `${jd}

${notes}`;
    const results = scoreDocs(query, docs.map(d => ({ id: d.id, text: d.text })));

    const withMeta = results.map(r => {
      const doc = docs.find(d => d.id === r.id)!;
      return {
        filename: doc.name,
        score: r.score,
        matchedKeywords: r.matchedKeywords,
        preview: doc.preview
      };
    });

    return NextResponse.json({ results: withMeta }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to process resumes.' }, { status: 500 });
  }
}
