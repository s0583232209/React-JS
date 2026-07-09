# React Text Editor (Grad: 97%)

A browser-based, multi-document text editor built from scratch in **React 19**, featuring a custom on-screen keyboard (English, Hebrew, and Emoji layouts), per-character text styling, undo history, and local persistence — all without a backend or a rich-text library.

This project exists primarily as a **React learning/showcase project**: it deliberately builds features that are normally handled by `<textarea>`, `contenteditable`, or a rich-text editor library (Draft.js, Slate, etc.) using plain React state, to demonstrate component composition, controlled state, lifting state up, and derived rendering.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture & Core Concepts](#architecture--core-concepts)
- [Component Reference](#component-reference)
- [Data Model](#data-model)
- [Persistence Model](#persistence-model)
- [Known Limitations](#known-limitations)
- [License](#license)

## Features

- **Custom on-screen keyboard** — no native keyboard input is used for typing; every character is a click/tap on a rendered `Key` component.
- **Multi-language layouts** — switch between English (LTR), Hebrew (RTL), and an Emoji keyboard. Switching language automatically flips text direction (`dir="ltr" / "rtl"`).
- **Character-level styling** — apply color, font family, and font size either to *future* keystrokes only, or retroactively to *all* text in the active document.
- **Multi-document editing** — open several documents ("text areas") at once, switch the active one, and close them individually.
- **Undo history** — every mutation snapshots the document state into a backup stack that can be popped to revert the last change.
- **Search & highlight** — search for a character/string in the active document and highlight matches.
- **Click-to-edit characters** — click any rendered character to edit it in place.
- **Local persistence (no backend)** — user accounts, credentials, and saved documents are stored in the browser via `localStorage`/`sessionStorage`.
- **Save / Save As** — save the active document under a new name, or update a previously saved one.
- **Reopen saved documents** — browse and reopen any document previously saved by the logged-in user.

## Tech Stack

| Layer            | Technology                          |
|-------------------|--------------------------------------|
| UI library        | [React 19](https://react.dev/) (function components + hooks) |
| Build tool         | [Vite 7](https://vite.dev/)         |
| Linting            | ESLint 9 (flat config) + `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` |
| Styling            | Plain CSS Modules-free stylesheets (one `.css` file per component) |
| State management   | React local component state (`useState`) — no Redux/Context/external store |
| Persistence        | Browser `localStorage` / `sessionStorage` (no server, no database) |

> This project intentionally has **no backend, no router, and no global state library** — it's a focused exercise in React fundamentals (state, props, controlled inputs, conditional rendering, lists & keys).

## Project Structure

```
react-project/
├── public/                      # Static assets served as-is
├── src/
│   ├── main.jsx                 # App entry point, mounts <App /> to #root
│   ├── App.jsx                  # Top-level component: switches between Auth and Editor
│   ├── App.css
│   ├── index.css                # Global styles
│   └── components/
│       ├── Authentication/
│       │   └── LogInSighUp.jsx  # Login / Sign-up form (localStorage-backed auth)
│       ├── Editor/
│       │   └── Editor.jsx       # Core editor: owns document state, wires all sub-components
│       ├── ActionButtons/
│       │   ├── ActionBar.jsx    # Toolbar: undo, delete, search, open/new document
│       │   └── ActionButton.jsx # Generic toolbar button
│       ├── designRuller/
│       │   ├── DesignRuller.jsx # Style controls: color, font, font size
│       │   └── fontsData.jsx    # List of available font families
│       ├── textArea/
│       │   ├── TextAreasDisplayer.jsx # Renders all open documents
│       │   └── TextArea.jsx     # A single document's rendered content
│       ├── keyboard/
│       │   ├── Keyboard.jsx     # Renders the active on-screen keyboard layout
│       │   ├── Key.jsx          # A single keyboard key
│       │   └── KeyboardData.jsx # Layout data for English / Hebrew / Emoji
│       └── FileManager/
│           ├── Saving/
│           │   ├── SavingController.jsx # "Save" / "Save as" logic and UI
│           │   └── savingForm.jsx       # Filename input form for "Save as"
│           └── OpenCloseFile.jsx/
│               └── OldFileList.jsx      # List of previously saved documents
├── index.html                   # Vite HTML entry point
├── vite.config.js               # Vite + @vitejs/plugin-react config
├── eslint.config.js             # ESLint flat config
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended for Vite 7)
- npm (bundled with Node.js)

### Installation

```bash
git clone https://github.com/s0583232209/React-JS.git
cd react-project
npm install
```

### Run in development

```bash
npm run dev
```

This starts the Vite dev server (with Hot Module Replacement) — open the printed local URL in your browser.

### Build for production

```bash
npm run build
```

Outputs a static, production-ready bundle to `dist/`.

### Preview the production build

```bash
npm run preview
```

## Available Scripts

| Script            | Description                                      |
|--------------------|---------------------------------------------------|
| `npm run dev`      | Start the Vite development server                |
| `npm run build`    | Bundle the app for production into `dist/`        |
| `npm run lint`     | Run ESLint across the project                     |
| `npm run preview`  | Serve the built `dist/` folder locally            |

## Architecture & Core Concepts

### 1. Text is not native input — it's an array of objects

Instead of storing document content as a string in a `<textarea>`, every character typed on the on-screen keyboard becomes an object:

```js
{
  char: 'a',
  style: { color: 'white', fontFamily: 'arial', fontSize: '20px', backgroundColor: 'none' },
  id: 42,
  textArea: 0
}
```

`Editor.jsx` keeps the **entire document set** as `text`, an array of arrays — one array of character-objects per open document. Each character carries its own style, which is what allows per-character coloring/fonts and click-to-edit.

### 2. Rendering: array → `<span>` elements

`TextArea.jsx` maps each character-object to a `<span>` (or `<br>` for `'enter'`), applying the object's inline `style` and wiring `onClick` so any character can be selected for in-place editing (`changeChar` in `Editor.jsx`).

### 3. The on-screen keyboard drives all typing

`Keyboard.jsx` renders a grid of `Key` buttons sourced from `KeyboardData.jsx` (English/Hebrew/Emoji layouts). Every key click calls back up to `Editor.jsx`'s `onKeyClick`, which either:
- appends a new character to the active document (default), or
- feeds into a special "next click" handler (used by search and click-to-edit flows) via a module-level `functionToRunAfterKeyClick` reference.

### 4. Undo via full-state snapshots

Every mutating action pushes a deep copy of the text state onto `backupText` (a stack). `ActionBar.jsx`'s `undo()` pops the stack and restores the previous snapshot — a simple, brute-force but effective undo model.

### 5. Styling: "future text" vs "all text"

`DesignRuller.jsx` offers two modes:
- **Style Future Text** — updates `currentStyle`, which is applied to the *next* characters typed.
- **Style All Text** — retroactively rewrites the `style` of every character already in the active document.

### 6. Authentication and persistence are entirely client-side

There is no server. `LogInSighUp.jsx` reads/writes user records directly to `localStorage` (keyed by username) and marks the active session in `sessionStorage`. Saved documents live inside that same per-user `localStorage` record, under `files`.

## Component Reference

| Component | Responsibility |
|---|---|
| `App` | Root component. Renders the auth screen or the `Editor`, based on `isLoggedIn`. Handles logout confirmation. |
| `LogInSignUp` | Controlled form for login/sign-up; validates against `localStorage` user records. |
| `Editor` | Owns all document state (`text`, `textAreas`, `activeTextArea`, `backupText`, `currentStyle`, `language`, `direction`) and coordinates every child component. |
| `ActionBar` / `ActionButton` | Toolbar for undo, delete (one char / one word / all), search, opening old files, and creating new documents. |
| `DesignRuller` | Style controls for color, font family, and font size, with a future-only vs. apply-to-all toggle. |
| `TextAreasDisplayer` / `TextArea` | Renders all open documents and an individual document's character stream with a blinking cursor. |
| `Keyboard` / `Key` / `KeyboardData` | On-screen keyboard UI and layout data for English, Hebrew, and Emoji, plus the language/direction switcher. |
| `SavingController` / `savingForm` | "Save" and "Save as" UI and logic, persisting to `localStorage`. |
| `OldFileList` | Lists a user's previously saved documents and reopens the selected one. |

## Data Model

**Document state** (per open document, held in `Editor`'s `text` array):

```
text: Array<Array<CharObject>>
CharObject = {
  char: string,        // a letter, symbol, emoji, ' ', or 'enter'
  style: {
    color: string,
    fontFamily: string,
    fontSize: string,
    backgroundColor: string
  },
  id: number,           // unique, monotonically increasing
  textArea: number       // index of the document this character belongs to
}
```

**Open documents / tabs:**

```
textAreas: Array<{ id: number, fileName?: string }>
```

## Persistence Model

All persistence happens in the browser — nothing is sent over the network.

| Key | Storage | Shape |
|---|---|---|
| `<username>` | `localStorage` | `{ name, password, files: [{ name, text }] }` |
| `current-user` | `sessionStorage` | JSON string of the logged-in username |

> **Note:** Passwords are stored in plain text in `localStorage`. This is acceptable for a local learning/demo project but is **not** a pattern to use in a real, production authentication system.

## Known Limitations

- No backend — data is local to the browser/device and is lost if browser storage is cleared.
- Passwords are stored unencrypted in `localStorage` (demo purposes only).
- No automated test suite is currently included.
- Designed and tested primarily for desktop browsers; on-screen keyboard interaction is not optimized for touch devices.

## License

This project does not currently declare a license. All rights reserved by the repository owner unless stated otherwise.
