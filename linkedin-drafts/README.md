# LinkedIn post drafts

Everything in this folder is a **draft**. Nothing here is ever posted automatically: you read it, edit it
and publish it yourself. Each file is one post plus its first comment.

## How to use a draft

1. Open a `*.md` file whose header says `status: draft`.
2. Read the post. It goes out under your name, so change or delete anything you would not stand behind.
   Drafts marked **Sensitive topic** (health, legal, tax, customs, regulation) must be checked against the
   official source before you post, or skipped.
3. Copy the block under **Post** into LinkedIn and publish it.
4. Immediately add the block under **First comment** as your first comment. The link lives there on purpose:
   LinkedIn tends to show posts with links in the body to fewer people, and the `utm_` parameters let Google
   Analytics attribute the visits to LinkedIn.
5. Edit the header: set `status: published # 2026-09-25` (or whatever the date is). Commit the change if you
   want the repo to remember it.

## How drafts are made

- `node scripts/linkedin-drafts.js` writes one draft (the three calculators first, then the newest article
  that has no draft yet, avoiding the topic of the last two drafts).
  Options: `--count 3`, `--tools`, `--slug <article-slug>`, `--dry` (print only).
- `.github/workflows/linkedin-drafts.yml` runs it Monday, Wednesday and Friday and commits the result, so
  `git pull` gives you new drafts. Run it by hand from the Actions tab (input: how many).
- `index.json` remembers which article or calculator already has a draft. Delete an entry (and its file) to
  have it drafted again.

## Rules the script enforces (scripts/lib/linkedin-quality.js)

A draft is rejected and regenerated (up to 4 attempts) unless it:

- uses no first person (no "I", "we", "our"): you have no personal story, team, clients or dataset to cite, so
  the posts are written in a neutral editorial voice;
- contains only figures that appear in the source. **Article posts contain no statistics at all**, because the
  articles' own statistics are not independently verified; calculator posts may use their worked examples;
- has no invented anecdotes or first-party claims, no URL or brand name in the body, no engagement bait
  ("comment below", "tag someone"), no hype words, at most one emoji and three hashtags;
- has a hook of at most 150 characters and a total length of 500 to 1,400 characters.

These checks catch fabrication patterns; they cannot tell whether a sentence taken from an article is
true. That is why you read every draft.

## Tests

`node scripts/lib/linkedin-quality.test.js`
