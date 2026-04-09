# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A seasonal color analysis quiz — a single-page static website styled after Vogue.com that determines a user's best color palette (Spring, Summer, Autumn, Winter) based on their natural coloring.

## Tech Stack

Pure HTML/CSS/JS in one file (`index.html`). No build tools, no frameworks, no package manager. External dependencies are Google Fonts (loaded via CDN) and Unsplash (images loaded via URL).

## Running Locally

Open `index.html` directly in a browser, or serve it:
```
python3 -m http.server 8000
```

There are no build, lint, or test commands.

## Architecture

Everything lives in `index.html`:

- **CSS (top)**: Vogue-editorial styling using CSS custom properties in `:root` for the color system. Responsive breakpoints at 600px.
- **HTML (middle)**: Three main sections — `#hero` (landing), `#quiz` (questions), `#results` (dynamically rendered).
- **JavaScript (bottom)**: Two data structures drive the app:
  - `questions[]` — 7 question objects with options that map to scoring values. Last two questions use `type: 'visual'` for swatch-based UI.
  - `seasonData{}` — keyed by season name, contains palette colors, advice text, celebrity matches, Unsplash photo URLs, and colors to avoid.

**Quiz flow**: `startQuiz()` → `renderQuestion()` loops → `nextQuestion()` advances or calls `showResults()` → `calculateSeason()` tallies scores → `showResults()` builds the results page via template literals injected into `#results`.

**Scoring**: Each answer value (e.g., `'warm'`, `'cool-deep'`) maps to weighted season points via `mapping` in `calculateSeason()`. Highest total wins.

## Design Conventions

- Typography: Playfair Display (headings), Cormorant Garamond (body/accents), Inter (UI/labels)
- Color tokens use CSS custom properties (`--spring-primary`, `--accent`, etc.)
- Animations use `cubic-bezier(0.25, 0.46, 0.45, 0.94)` easing and the `fadeUp` keyframe
- Editorial photo breaks use Unsplash URLs with `?w=` and `?q=` parameters for sizing
