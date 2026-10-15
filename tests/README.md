# Browser verification

Start the app with `./start.sh`. Install Python Playwright if needed (`python3 -m pip install playwright`), and have Chrome at `/usr/bin/google-chrome`, or change `executable_path` in the script.

Run `python3 tests/browser_smoke.py` from the project root. It creates an isolated browser context with fictional test records and screenshots in `artifacts/`.

The test verifies separate entry flows, learning resources, downloads, assignment submission, teacher grading, student feedback, resource publishing, attendance, announcements, student creation, reports, every module, language switching, and horizontal overflow at four viewport widths. It also fails on browser JavaScript errors.

Additional checks:

- `python3 tests/group_navigation.py`: verifies group filters when navigating from group cards, and the attendance group fallback.
- `python3 tests/accessibility.py`: checks all 18 module pages at 320, 768, 1024, and 1440px, and runs the bundled axe-core WCAG 2.1 AA rules. Automated checks supplement manual visual and keyboard review; they do not certify complete accessibility.
- `python3 tests/production_smoke.py`: after `npm run build` and `npm run preview -- --port 4173`, verifies built assets, role entry, language/date/currency rendering, presentation mode, dialog keyboard focus, and the mobile menu.
