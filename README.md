# Qaseeda — Arabic Poem Learning App

A child-friendly web app that helps children listen to and memorize an Arabic poem. Children can click any couplet to hear its matching recitation.

## Features

- Five Arabic couplets displayed as images
- Recorded audio synchronized with each couplet
- Configurable repeat mode, from 2 to 20 repetitions
- Default repeat count of 5
- Two-second pause between repetitions
- Listening progress and completion reward
- Responsive layout for Android tablets, phones, and computers
- No build tools or installation required

## Run locally

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser.

## Audio sections

The app uses the authorized recording at `couplets/source-audio.webm` and plays these sections:

- Couplet 1: `00:26–00:43`
- Couplet 2: `00:43–01:01`
- Couplet 3: `01:01–01:22`
- Couplet 4: `01:23–01:44`
- Couplet 5: `01:45–02:08`

The start and end times can be changed in the `couplets` array at the top of `app.js`.

## Repeat mode

Choose a repeat count between 2 and 20, then enable the **Repeat** button before selecting a couplet. The default is 5 repetitions, with a two-second pause between each playback.

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`. Every push to the `main` branch automatically deploys the website to GitHub Pages.

In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the deployment source.
