# Resume Ranker

A Next.js app that ranks resumes against JD + Intake Notes using TF‑IDF. No API keys.

## Prerequisites
- Node.js 18 or 20
- Git and a GitHub account
- Vercel account (free plan is fine)

## Local run

```bash
# clone your repo (create one on GitHub first)
git clone https://github.com/<you>/resume-ranker.git
cd resume-ranker

# install
pnpm i   # or: npm i  or: yarn

# dev server
pnpm dev  # open http://localhost:3000
```

If the page loads, paste a JD, paste intake notes, upload a few test resumes, and confirm you get a ranked list.

## Deploy to Vercel (GitHub flow)
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/import and select the repo.
3. Framework: **Next.js** (auto-detected).
4. No environment variables needed.
5. Build command: `next build` (auto).
6. Output directory: `.next` (auto).
7. Click **Deploy**.

After build finishes, Vercel gives you a URL. Open it and test by uploading a few PDFs, DOCX, or TXT files.

### Notes about uploads
- Keep total upload size modest. If you upload many large scanned PDFs, the API may time out on free tiers.
- The included `vercel.json` asks for more time and memory for the API. If your plan does not allow it, large files can still time out. Try fewer files or smaller PDFs.

## Troubleshooting
**413 or payload too large**
- Try fewer files, or smaller PDFs. Avoid large scanned images. Text PDFs parse much faster.

**Request timed out**
- Try 1 to 3 resumes first, then increase. The provided `vercel.json` requests a longer timeout where available.

**500: Failed to process resumes**
- Make sure files are `.pdf`, `.docx`, or `.txt`. Old `.doc` files will not parse.
- Try the same files locally to see console errors for clues.

**DOCX parsing issues**
- Save as modern `.docx` from Word or Google Docs, then retry.

**Nothing ranks or scores are zero**
- Make sure you filled both JD and Intake Notes. The API requires both.

## Optional extensions
- Must-have keywords filter.
- Weight slider for Notes vs JD (example: 70 percent Notes, 30 percent JD).
- CSV columns for phone and email if present.
