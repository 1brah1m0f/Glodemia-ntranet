# Glodemia OS

A React sales demo with three separate, bilingual workspaces: administration, student learning, and teacher supervision. Built specifically around Glodemia's verified identity.

## Run

```bash
./start.sh
```

Open **http://localhost:5173**. The script uses an existing Node installation or the local Node 22 runtime installed for this workspace. On another machine, install Node.js 22.12+ first, then:

```bash
npm ci
npm run dev
```

Build with `npm run build`; preview the built app with `npm run preview`.

## Separate demo entry points

| Workspace | URL | Demo profile |
| --- | --- | --- |
| Admin | http://localhost:5173/#/login/admin | Nigar Əhmədova |
| Student | http://localhost:5173/#/login/student | Aylin Məmmədova |
| Teacher | http://localhost:5173/#/login/teacher | Nigar Əliyeva |

Choose a role and click **Demo panelə daxil ol / Enter demo workspace**. No password is required. Sign out to return to the role-specific entry screen. AZ/EN language selection is available on entry and throughout every workspace.

## What's connected

- Admin: overview, searchable student directory, student creation and profiles, groups, weekly schedule, team, payment recording, CSV export.
- Student: dashboard, searchable course library, bookmarks, lesson previews and downloads, reading progress, assignment responses, weekly schedule, grades and feedback.
- Teacher: own groups and students, attendance register, assignment review, scores and feedback, bilingual material publishing, group announcements.
- A student's submitted answer appears in the teacher's review list. The teacher's score and feedback then appear in the student's progress page.
- Teacher-published IELTS materials and announcements appear in Aylin's library and dashboard. Saved attendance updates the student profile and admin metrics.
- All data uses the same fictional students, groups, and instructors. Metrics such as enrollment, tuition collection, and group membership derive from that data. Trend lines remain illustrative demo analytics.

## Recording two videos

See [DEMO-GUIDE.md](DEMO-GUIDE.md) for a short Azerbaijani recording sequence. Use a 1440×900 or 1920×1080 browser window. The top-right expand icon toggles presentation mode, which hides secondary search and help details while keeping the Demo Environment label visible.

## Demo storage

All records are fictional and stored in this browser under `glodemia-os-v2`. The selected session role is stored in session storage. Data persists across refreshes and role changes in the same browser, but does not sync across devices. No emails, production authentication, or backend services are connected. Entry screens are a demonstration of role separation, not production access control. Clear this site's browser storage for a fresh demo.

## Verified brand sources

Visually reviewed and extracted on October 15, 2026:

- https://glodemia.az/ — official original dark and light logos, blue accent actions, white surfaces, rounded buttons, educational personality.
- https://glodemia.az/resources/css/bootstrap.min.css — primary `#0088b4`, secondary `#17303b`, Inter body, Roboto headings.
- https://glodemia.az/resources/css/style.css — brand button, navigation, and border treatments.

Original logos are in `public/assets/`. Fonts are bundled locally for reliable recording. Neutral surfaces, semantic state colors, and readable component spacing extend the identity to an internal product. An accessible darker shade (`#006d91`) is derived from the primary blue for small text and filled actions; it is an interface adaptation, not an additional claimed official brand color. Tokens are defined in `src/styles.css`.

## Structure

- `src/context.jsx`: shared, versioned local demo state, language, and navigation.
- `src/data.js`: interconnected fictional data and bilingual learning content.
- `src/pages/`: distinct admin, student, teacher, and entry experiences.
- `src/components/`: shared shell, dialogs, learning components, and interactive chart.

Browser verification covers all role entry flows, AZ/EN, submission → grading → feedback, material publishing, attendance, announcements, student creation, exports, and responsive layouts. See `tests/README.md` for how to rerun it.
