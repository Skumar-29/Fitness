FITNESS V4 — ANATOMY COACH, BILINGUAL GUIDANCE & CLOUD SYNC
=============================================================

Build: fitness-v4.0.0-preview
Schema: 4
Service-worker shell: fitness-v4-shell-v1
Approved media cache: fitness-v4-approved-anatomy-media-v1
Release type: Functional V4 foundation and approved-media preview

WHAT IS INCLUDED
----------------
• Six structured workout days plus a recovery day.
• Exact 30-, 45- and 60-minute workout versions.
• Automatic guided sequence: exercise → rest → next preview → countdown → next exercise.
• Pause, previous, next, extra time, easier option, progression and replacement controls.
• Workout Focus Mode, browser fullscreen where supported, and responsive portrait/landscape layouts.
• Windows, Mac, iPhone, iPad and Android responsive PWA layout.
• English and Hindi interface switching.
• English and Hindi written instructions, muscle names, benefits and safety cues.
• English and Hindi spoken coaching using the device/browser speech engine.
• Full instructions, essential cues and voice-off modes.
• Exercise information rail showing target muscles, how-to, breathing, mistakes, reps/time, equipment, difficulty and benefits.
• Vegetarian, Indian vegetarian, vegan and high-protein meal guidance.
• Progress, measurements, fitness tests, backup and restore.
• Local-first saving and optional automatic Firebase cloud synchronisation.
• Google sign-in and email/password sign-in after Firebase setup.
• Offline app shell, approved-video caching and downloadable media controls.
• Migration of compatible V2/V3 locally stored data on the same website address.

APPROVED VIDEO STATUS
---------------------
The previous unclear robotic/vector video library has been removed from this package.

Included approved anatomical samples:
• Bodyweight Squat — assets/videos/squat.mp4
• Reverse Lunge — assets/videos/reverseLunge.mp4

These samples use the requested full anatomical-human presentation with a clean light background and red working-muscle highlights. All other exercises show a clear “video awaiting approval” panel while their English/Hindi written and spoken guidance remains active.

This is intentional. It prevents the old unclear media from returning and avoids presenting unreviewed AI movement as correct exercise form. See VIDEO_MEDIA_STATUS.txt before publishing the complete media library.

CLOUD SYNC STATUS
-----------------
The account and synchronisation code is included, but cloud sync remains disabled until the app owner creates a Firebase project and pastes that project’s web configuration into firebase-config.js.

After setup, the app can synchronise:
• profile and workout preferences
• completed workouts and active-session position
• measurements and fitness tests
• language and voice preferences
• program progress and selected settings

Local saving continues even without Firebase or internet. See FIREBASE_SETUP_GUIDE.txt.

VOICE COACH
-----------
The app requests an English or Hindi voice installed on the device. Voice availability and pronunciation depend on the browser and operating system. The exercise videos remain muted so they do not conflict with coaching.

On iPhone, if Hindi pronunciation is not satisfactory:
Settings → Accessibility → Spoken Content → Voices → Hindi
Download a preferred Hindi voice, reopen Fitness V4, and preview it from the app settings.

INSTALLATION
------------
1. Extract the ZIP.
2. Upload everything inside the extracted folder to the root of a GitHub repository.
3. Confirm index.html is visible directly on the repository’s main page.
4. Enable GitHub Pages: Settings → Pages → Deploy from a branch → main → /(root).
5. Open the Pages address online once.
6. On iPhone Safari: Share → Add to Home Screen.
7. On a supported Mac Safari: File/Share → Add to Dock.
8. On Windows Edge/Chrome: use the Install App option in the address bar or browser menu.

SAFETY
------
Fitness V4 provides general educational fitness and food guidance. It is not medical diagnosis, rehabilitation, physiotherapy or an individually prescribed diet. Start gradually, use an easier option when needed, and stop for chest pain, faintness, severe or unusual breathlessness, or sharp/worsening pain. Seek appropriate professional advice when a medical condition, injury, pregnancy, recent surgery or prescribed restriction could affect exercise.
