# Mathdeck Keyboard

A Chrome extension for writing and inserting math equations — pure HTML/CSS/JS, no build step.

## Install locally

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this folder

## Features

- **6 keyboard tabs** — Basic, Algebra, Calculus, Pure Math, Statistics, Physics
- **Mixed text + math** — write full sentences with inline equations (like a textbook)
- **Matrix builder** — any size up to 8×8 with 6 bracket types
- **200+ keys** covering all standard mathematical and physical notation
- **Copy as** LaTeX, Typst, or PNG image
- **Insert into page** — injects directly into any focused input or contenteditable
- **Custom buttons** — 10 user-defined slots
- **Undo / redo**, equation history, light/dark/auto theme, font color and size settings

## Usage

Type prose in **Text mode** (spaces work normally). Press **Alt+=** or click the mode button to switch to **Math mode** for equations. Click any keyboard key to insert notation at the cursor — works mid-sentence without breaking your text.

## Stack

- [MathLive](https://mathlive.io) for the math field and rendering
- Manifest V3 — permissions: `activeTab`, `scripting`, `storage`, `clipboardWrite`
