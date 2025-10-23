# ITT NewsCentral Composer & Slides System

## Overview
The ITT NewsCentral Composer is an HTML and JavaScript application that aggregates newsroom data, allows producers to curate stories, and generates ticker and slide queues for Indiana Travel TV broadcasts. It can be launched locally (for example, `file:///G:/My Drive/ITT/Ticker/ITT_NewsCentral.html`) or hosted on a lightweight static web server.

## Architecture
| File | Purpose |
| --- | --- |
| `ITT_NewsCentral_Composer.html` | Main application shell with HTML, Tailwind CSS, and JavaScript |
| `feedService.js` | Fetches RSS/JSON feeds and normalizes data |
| `editorTuner.js` | Handles tuner grid rendering, editing logic, and state management |
| `queueBuilder.js` | Builds ticker and slide queues from curated items |
| `obsPreview.js` | Renders OBS-ready previews of slides and ticker |
| `lowerThirdDesigner.js` | Provides lower third overlay designer tooling |
| `settingsPanel.js` | Manages configuration inputs and persistence |
| `composer.css` | Optional style overrides |

## Data Flow
1. Fetch feeds from the Google Sheets "Feeds" tab.
2. Normalize RSS/JSON feeds via `feedService.js`.
3. Curate content within the Editor/Tuner grid.
4. Build ticker and slide queues (`QUEUE_TICKER`, `QUEUE_SLIDES`).
5. Preview and sync data to Google Apps Script endpoints.

## Feed Processing Highlights
- RSS content is proxied through `corsproxy.io`, parsed, and mapped into standardized objects.
- JSON feeds are normalized from common structures (`articles`, `items`, `results`, `data`).
- Image extraction handles RSS `<media:content>` and JSON `featured_media` patterns.
- Source detection tags known publishers (e.g., Indiana Capital Chronicle).

## Editor & Tuner Features
- Enable/disable stories, adjust weights, and edit copy inline.
- Supports drag-and-drop ordering, undo/redo, and auto-refresh intervals.
- State object (`st`) tracks feeds, items, queues, and settings.

## Queue Builder
- Filters enabled items and sorts by weight.
- Builds ticker entries with formatted text and queue duration based on character counts.
- Builds slides with images, video URLs, audio options, and source metadata.
- Enforces maximum queue size from settings.

## OBS Preview Engine
- Slide preview cycles through slides with fade transitions, images, or autoplaying videos.
- Ticker preview assembles concatenated ticker text with CSS-based scrolling animation.

## Audio Support
- Optional per-slide audio with gain, loop, trim, and fade controls.
- Supports ticker ducking (6–12 dB) during audio playback.

## Lower Third Designer
- Configures text, colors, alignment, and font size for overlay exports.
- Exports JSON (`lower_third.json`) for downstream systems.

## Settings & Persistence
- Saves GAS URL/token, ticker speed, slide duration, and proxy toggles to `localStorage`.
- Supports settings export/import as JSON.
- Keyboard shortcuts: `Ctrl+S` (save settings), `Ctrl+R` (rebuild queues), `Ctrl+Z`/`Ctrl+Shift+Z` (undo/redo).

## GAS Integration
- Syncs ticker and slide queues to Google Apps Script endpoints using bearer authentication.
- Supports legacy `action: appendQueues` payloads and REST endpoints (`/api/ingest`, `/api/queue/rebuild`).

## Data Structures
```json
Ticker Item {
  "id": "news_abc123",
  "ticker_text": "[Source] Headline — Credit",
  "weight": 10,
  "url": "https://example.com"
}

Slide Item {
  "id": "news_abc123",
  "title": "Headline",
  "slide_text": "Summary or body text",
  "image_url": "https://cdn/image.jpg",
  "video_url": "https://cdn/video.mp4",
  "audio_url": "https://cdn/audio.mp3",
  "audio_gain_db": -6,
  "category": "News",
  "source": "Indiana Capital Chronicle"
}
```

## Export & Preview Modes
- Preview: OBS-safe 16:9 canvas with ticker, slides, audio, and lower thirds.
- Export: JSON export (`ITT_Queue_Export.json`) for offline consumption.
- Automatic rebuilds after edits ensure ticker speed recalculations.

## Planned Enhancements
- AI-assisted summarization for ticker lines.
- Slide template packs for rapid layout changes.
- Real-time weather ticker integration (OpenWeather/NOAA APIs).
- Voice narration embedding (e.g., ElevenLabs, Fliki).
- Cloud-hosted Composer with user authentication.
