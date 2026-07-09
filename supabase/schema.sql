-- ============================================================================
--  Portfolio — Supabase schema + demo seed
-- ============================================================================
--  Paste this whole file into the Supabase SQL Editor and click Run.
--  It creates the tables, seeds demo content (idempotent), and applies RLS.
--  Safe to re-run. To reset: TRUNCATE TABLE ... RESTART IDENTITY;
--
--  Image uploads go to a Supabase Storage bucket named 'uploads'
--  (or SUPABASE_STORAGE_BUCKET).
-- ============================================================================

CREATE TABLE IF NOT EXISTS site (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  status_text TEXT NOT NULL DEFAULT '',
  copyright TEXT NOT NULL DEFAULT '',
  nav_cta_text TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS hero (
  id INTEGER PRIMARY KEY,
  kicker TEXT NOT NULL DEFAULT '',
  name_line1 TEXT NOT NULL DEFAULT '',
  name_line2 TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  rotating_words TEXT NOT NULL DEFAULT '',
  status_text TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  star_image TEXT NOT NULL DEFAULT '',
  float_note TEXT NOT NULL DEFAULT '',
  chips TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY,
  kicker TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  paragraphs TEXT NOT NULL DEFAULT '',
  accent TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS marquee (
  id INTEGER PRIMARY KEY,
  m1 TEXT NOT NULL DEFAULT '',
  m2 TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS contact (
  id INTEGER PRIMARY KEY,
  kicker TEXT NOT NULL DEFAULT '',
  headline_before TEXT NOT NULL DEFAULT '',
  headline_circled TEXT NOT NULL DEFAULT '',
  headline_after TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT '',
  cta_url TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  copy_text TEXT NOT NULL DEFAULT '',
  featured_cta_text TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0,
  suffix TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS currently_items (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL DEFAULT '',
  sub TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS content_items (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  link_text TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_links (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL DEFAULT '',
  value TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO site (id, name, tagline, status_text, copyright, nav_cta_text)
SELECT 1, $v0$AVERY QUINN$v0$, $v1$Founder, builder, creator. Doing too much with too little — and refusing to stop.$v1$, $v2$open to collabs$v2$, $v3$© 2026 Avery Quinn$v3$, $v4$Get in touch$v4$
WHERE NOT EXISTS (SELECT 1 FROM site WHERE id = 1);

INSERT INTO hero (id, kicker, name_line1, name_line2, note, subtitle, rotating_words, status_text, email, star_image, float_note, chips)
SELECT 1, $v5$founder · builder · creator$v5$, $v6$AVERY$v6$, $v7$QUINN$v7$, $v8$call me Ave ✶$v8$, $v9$I make weird, useful things on the internet and refuse to pick just one lane.$v9$, $v10$Founder
Builder
21km Runner
Content Creator
Chaos Connoisseur$v10$, $v11$open to collabs$v11$, $v12$hello@averyquinn.com$v12$, $v13$$v13$, $v14$still figuring it out (on purpose)$v14$, $v15$[{"text":"personal brand","color":"yellow"},{"text":"AI tinkerer","color":"mint"},{"text":"night owl","color":"pink"}]$v15$
WHERE NOT EXISTS (SELECT 1 FROM hero WHERE id = 1);

INSERT INTO about (id, kicker, title, paragraphs, accent)
SELECT 1, $v16$the human behind it$v16$, $v17$WHO I AM$v17$, $v18$I'm Avery — everyone calls me Ave. I have [[too many things going on at once]] and I've stopped pretending that's a problem.
Right now I'm building a small AI tool because people do impressive things every day and have no clean way to prove them. [[It evaluates — it doesn't flatter.]] Weak evidence gets low confidence, and numbers are never invented.
Before this I sold my first website to a local business, ran a half marathon, and somehow coordinated events for 500+ people. I don't fully know how, either.
[[Mindset: execution over theory. Always has been.]]$v18$, $v19$creator, not influencer$v19$
WHERE NOT EXISTS (SELECT 1 FROM about WHERE id = 1);

INSERT INTO marquee (id, m1, m2)
SELECT 1, $v20$Founder / Builder / 21km Runner / Content Creator / Execution over Theory / Unseen — Evidence Engine$v20$, $v21$Doing too much with too little ✶ Refusing to stop ✶ Build in public ✶ Show up daily$v21$
WHERE NOT EXISTS (SELECT 1 FROM marquee WHERE id = 1);

INSERT INTO contact (id, kicker, headline_before, headline_circled, headline_after, body, cta_text, cta_url, email, copy_text, featured_cta_text)
SELECT 1, $v22$say hi$v22$, $v23$Got an $v23$, $v24$idea?$v24$, $v25$
Let's build.$v25$, $v26$I'm open to collabs, interesting projects, and conversations with people who are actually doing things. Reach out.$v26$, $v27$Email me ↗$v27$, $v28$mailto:hello@averyquinn.com$v28$, $v29$hello@averyquinn.com$v29$, $v30$Copy email address$v30$, $v31$Currently booking 2 collabs for the summer →$v31$
WHERE NOT EXISTS (SELECT 1 FROM contact WHERE id = 1);

INSERT INTO stats (value, suffix, label, visible)
SELECT * FROM (VALUES
  (21, $v32$$v32$, $v33$km at 15$v33$, TRUE),
  (5, $v34$$v34$, $v35$team built$v35$, TRUE),
  (500, $v36$+$v36$, $v37$event attendees$v37$, TRUE)
) AS v(value, suffix, label, visible)
WHERE NOT EXISTS (SELECT 1 FROM stats);

INSERT INTO currently_items (text, sub, visible, display_order)
SELECT * FROM (VALUES
  ($v38$Building my AI side-project$v38$, $v39$evidence engine · proof over claims$v39$, TRUE, 0),
  ($v40$Finishing the semester$v40$, $v41$school exams · this season$v41$, TRUE, 1),
  ($v42$Growing my socials$v42$, $v43$Instagram · content creation$v43$, TRUE, 2),
  ($v44$Freelance web projects$v44$, $v45$local business sites$v45$, TRUE, 3),
  ($v46$Learning hardware$v46$, $v47$Arduino · robotics long-term$v47$, TRUE, 4)
) AS v(text, sub, visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM currently_items);

INSERT INTO projects (slug, title, tags, description, image, link, year, visible, display_order)
SELECT * FROM (VALUES
  ($v48$ohh-ave$v48$, $v49$@ohhave$v49$, $v50$['Personal Brand', 'Ongoing']$v50$, $v51$Building in public as a young founder. Content about building, running, and the chaos of doing too many things at once. Real, unfiltered — growing an audience of people who are actually doing things.$v51$, $v52$$v52$, $v53$https://instagram.com$v53$, $v54$2024—now$v54$, TRUE, 0),
  ($v55$unseen$v55$, $v56$Unseen$v56$, $v57$['AI Engine', 'Next.js', 'Problem-first']$v57$, $v58$Built around a real problem — people do impressive things and have no way to prove them. Describe a real experience and Unseen extracts the skills, scores how strongly the story proves each one, and turns it into resume bullets and LinkedIn blurbs. Evidence, not flattery.$v58$, $v59$$v59$, $v60$$v60$, $v61$2025$v61$, TRUE, 1),
  ($v62$arduino$v62$, $v63$Arduino + Microcontrollers$v63$, $v64$['Hardware', 'Learning']$v64$, $v65$Working through embedded systems, C/C++, and microcontroller fundamentals. The long-term direction is robotics — the goal is to eventually build things you can actually hold.$v65$, $v66$$v66$, $v67$$v67$, $v68$2026$v68$, TRUE, 2)
) AS v(slug, title, tags, description, image, link, year, visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM projects);

INSERT INTO achievements (year, title, description, visible, display_order)
SELECT * FROM (VALUES
  ($v69$2025 · Athletics$v69$, $v70$21km Half Marathon$v70$, $v71$Completed at 15. Proof of discipline, pain tolerance, and long-term commitment to something hard.$v71$, TRUE, 0),
  ($v72$2025 · Business$v72$, $v73$First Website Sold$v73$, $v74$Built and sold a single-page website to a local business. Handled everything — outreach, proposal, build, delivery.$v74$, TRUE, 1),
  ($v75$2026 · Startup$v75$, $v76$Built a 5-Person Team$v76$, $v77$Assembled a full product team from scratch — designer, developer, and more. All sourced independently.$v77$, TRUE, 2),
  ($v78$2024-25 · Comms$v78$, $v79$MUN — Best Delegation$v79$, $v80$Best Delegation and Special Mentions at regional MUNs. Started debating young.$v80$, TRUE, 3),
  ($v81$2024-26 · Leadership$v81$, $v82$Events Lead · 500+ Attendees$v82$, $v83$Lead coordinator for school events. End-to-end event management for the whole community.$v83$, TRUE, 4)
) AS v(year, title, description, visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM achievements);

INSERT INTO content_items (platform, name, description, url, link_text, visible, display_order)
SELECT * FROM (VALUES
  ($v84$Instagram$v84$, $v85$@ohhave$v85$, $v86$Building in public. The chaos of being a young founder — exams, product sprints, content, all at once.$v86$, $v87$https://instagram.com$v87$, $v88$Follow ↗$v88$, TRUE, 0),
  ($v89$Twitter / X$v89$, $v90$@avebuilds$v90$, $v91$Daily updates from the build. What shipped, what broke, what I learned.$v91$, $v92$https://x.com$v92$, $v93$Follow ↗$v93$, TRUE, 1),
  ($v94$YouTube$v94$, $v95$@avebuilds$v95$, $v96$Long-form story — the full picture of what building something looks like.$v96$, $v97$https://youtube.com$v97$, $v98$Subscribe ↗$v98$, TRUE, 2)
) AS v(platform, name, description, url, link_text, visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM content_items);

INSERT INTO contact_links (label, value, url, visible, display_order)
SELECT * FROM (VALUES
  ($v99$Email$v99$, $v100$hello@averyquinn.com$v100$, $v101$mailto:hello@averyquinn.com$v101$, TRUE, 0),
  ($v102$Instagram$v102$, $v103$@ohhave$v103$, $v104$https://instagram.com$v104$, TRUE, 1),
  ($v105$Twitter / X$v105$, $v106$@avebuilds$v106$, $v107$https://x.com$v107$, TRUE, 2),
  ($v108$YouTube$v108$, $v109$@avebuilds$v109$, $v110$https://youtube.com$v110$, TRUE, 3),
  ($v111$Phone$v111$, $v112$+1 555 0100$v112$, $v113$tel:+15550100$v113$, TRUE, 4)
) AS v(label, value, url, visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM contact_links);

-- ============================================================================
--  Row Level Security
--  The app uses the service_role key server-side (bypasses RLS), so admin
--  writes always work. These policies also allow public (anon/authenticated)
--  reads. Writes from the browser are never permitted.
-- ============================================================================
ALTER TABLE site ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE marquee ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE currently_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'site', 'hero', 'about', 'marquee', 'contact', 'stats',
    'currently_items', 'projects', 'achievements', 'content_items', 'contact_links'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "public read" ON %I;', t);
    EXECUTE format(
      'CREATE POLICY "public read" ON %I FOR SELECT TO anon, authenticated USING (true);',
      t
    );
  END LOOP;
END $$;
