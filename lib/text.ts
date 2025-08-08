export const STOP = new Set([
  'the','and','or','a','an','to','of','in','on','for','with','by','is','are','was','were','be','been','being','at','as','it','this','that','from','into','over','under','we','you','they','them','their','our','your','i','me','my','us','will','can','should','could','would','may','might','about','across','after','again','against','all','almost','also','although','among','because','before','between','both','but','during','each','few','more','most','other','some','such','than','then','there','these','those','through','until','while'
]);

export function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+.#/\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokens(s: string) {
  const t = norm(s).split(' ');
  return t.filter(x => x.length > 1 && !STOP.has(x));
}

export function topN<T>(arr: T[], n: number) {
  return arr.slice(0, Math.max(0, n));
}
