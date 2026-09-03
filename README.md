# Mathdeck Keyboard

A Chrome extension for writing and inserting math equations — pure HTML/CSS/JS, no build step.

## Install locally

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Run `npm install` and then `npm run build`
4. Click **Load unpacked** and select the generated `dist/` folder

## Features

- **6 keyboard tabs** — Basic, Algebra, Calculus, Pure Math, Statistics, Physics
- **Searchable symbol catalog** — find keys by symbol, LaTeX command, hint, or category
- **Set theory notation** — indexed families, unions, intersections, products, complements, and set builders
- **Mixed text + math** — write full sentences with inline equations (like a textbook)
- **Matrix builder** — any size up to 8×8 with 6 bracket types
- **200+ keys** covering all standard mathematical and physical notation
- **Copy as** LaTeX
- **Insert into page** — injects directly into any focused input or contenteditable
- **Custom buttons** — 10 user-defined slots
- **Undo / redo**, equation history, light/dark/auto theme, font color and size settings

## Usage

Type prose in **Text mode** (spaces work normally). Press **Alt+=** or click the mode button to switch to **Math mode** for equations. Click any keyboard key to insert notation at the cursor — works mid-sentence without breaking your text.

## Stack

- [MathLive](https://mathlive.io) for the math field and rendering
- [esbuild](https://esbuild.github.io) for the production bundle
- Manifest V3 — permissions: `activeTab`, `scripting`, `storage`, `clipboardWrite`

## Development checks

- `npm run check` validates the source JavaScript syntax.
- `npm test` builds `dist/` and verifies the packaged extension files.
