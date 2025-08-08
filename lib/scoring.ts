import { tokens } from './text';

type Doc = { id: string; text: string; };

function termCounts(tok: string[]) {
  const m = new Map<string, number>();
  for (const t of tok) m.set(t, (m.get(t) || 0) + 1);
  return m;
}

function cosine(a: Map<string, number>, b: Map<string, number>) {
  let dot = 0, na = 0, nb = 0;
  const seen = new Set<string>();
  for (const [k, v] of a) { na += v * v; seen.add(k); if (b.has(k)) dot += v * (b.get(k) || 0); }
  for (const [k, v] of b) { if (!seen.has(k)) nb += v * v; else nb += v * v; }
  na = Math.sqrt(na); nb = Math.sqrt(nb);
  if (na === 0 || nb === 0) return 0;
  return dot / (na * nb);
}

export function scoreDocs(queryText: string, resumes: Doc[]) {
  const qTok = tokens(queryText);
  const corp = [qTok, ...resumes.map(r => tokens(r.text))];
  const N = corp.length;

  // Document Frequencies
  const df = new Map<string, number>();
  for (const doc of corp) {
    const uniq = new Set(doc);
    for (const t of uniq) df.set(t, (df.get(t) || 0) + 1);
  }

  function tfidf(tok: string[]) {
    const tf = termCounts(tok);
    const v = new Map<string, number>();
    for (const [t, c] of tf) {
      const idf = Math.log((N + 1) / ((df.get(t) || 0) + 1)) + 1;
      v.set(t, (c / tok.length) * idf);
    }
    return v;
  }

  const qv = tfidf(qTok);
  const results = resumes.map(r => {
    const rv = tfidf(tokens(r.text));
    const s = cosine(qv, rv);

    // Matched terms for explainability
    const matches: { t: string; w: number }[] = [];
    for (const [t, w] of rv) if (qv.has(t)) matches.push({ t, w });
    matches.sort((a, b) => b.w - a.w);

    return {
      id: r.id,
      score: s,
      matchedKeywords: matches.slice(0, 30).map(m => m.t)
    };
  });

  results.sort((a, b) => b.score - a.score);
  return results;
}
