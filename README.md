# Mathdeck Keyboard

A Manifest V3 Chrome extension prototype for a compact math keyboard based on the supplied design references.

## Load locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder: `C:\Users\siddh\Downloads\Mathdeck`.

## Current features

- Six keyboard tabs: Basic, Pure math, Statistics, Physics, Chemistry, and Graph.
- Editable equation area with undo, redo, saved state, and recent equation recall.
- Custom buttons stored locally with `chrome.storage.local`.
- Settings for light, dark, auto theme, equation color, and equation size.
- Copy as text LaTeX, Typst-style text, or PNG image.
- Insert into the active page when an input, textarea, or contenteditable target is focused. If insertion is blocked or no field is found, Mathdeck copies the equation to the clipboard.

## Implementation notes

- The extension is intentionally vanilla HTML/CSS/JS, so no install or build step is required.
- It uses Manifest V3 permissions recommended by Chrome docs: `activeTab`, `scripting`, `storage`, and `clipboardWrite`.
- Page insertion is best-effort because opening a popup can move focus away from the page in some Chrome contexts.
