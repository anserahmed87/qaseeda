# Qaseeda — Arabic Poem Learning App

A child-friendly web app that helps children listen to and memorize an Arabic poem. Children can click any couplet to hear its matching recitation.

## Features

- Five Arabic couplets displayed as images
- Recorded audio synchronized with each couplet
- Configurable repeat mode, from 2 to 20 repetitions
- Default repeat count of 5
- Two-second pause between repetitions
- Optional slow playback at 75% speed
- Listening progress and completion reward
- Responsive layout for Android tablets, phones, and computers
- No build tools or installation required

## Run locally

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser.

## Local audio clips

Each couplet has its own lightweight local MP3 file:

- `couplets/1-audio.mp3` — extracted from `00:26–00:43`
- `couplets/2-audio.mp3` — extracted from `00:43–01:01`
- `couplets/3-audio.mp3` — extracted from `01:01–01:22`
- `couplets/4-audio.mp3` — extracted from `01:23–01:44`
- `couplets/5-audio.mp3` — extracted from `01:45–02:08`

The clips are mono MP3 files optimized for fast loading on mobile devices. The original full-length source recording is not included in the deployed site.

## Repeat mode

Choose a repeat count between 2 and 20, then enable the **Repeat** button before selecting a couplet. The default is 5 repetitions, with a two-second pause between each playback.

## Slow playback

Enable **Slow speed** to play a couplet at 75% of its normal speed while preserving the speaker's pitch. The setting also works during repeated playback and can be changed while audio is playing.

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`. Every push to the `main` branch automatically deploys the website to GitHub Pages.

In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the deployment source.
