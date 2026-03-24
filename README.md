# Modern Editorial Studio

A premium, multi-format desktop authoring environment for technical writers and editorial teams, built with React, Tailwind CSS, and Framer Motion.

## Features

- **The Digital Archivist Design System**: A bespoke aesthetic balancing print heritage with digital precision.
- **4 Curated Themes**:
  - **Alabaster & Charcoal**: The classic editorial look.
  - **Deep Archive**: A high-contrast dark mode for late-night drafting.
  - **Soft Sage**: An organic, calming palette.
  - **Dusty Rose**: A sophisticated, literary-inspired theme.
- **Zen Focus Mode**: Distraction-free writing with auto-fading UI.
- **Split Workspace**: Real-time Markdown preview with synchronized scrolling.
- **Command Palette**: Rapid access to tools via `Cmd+K`.
- **Editorial Pull-Quotes**: Custom-styled blockquotes for high-impact statements.

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion (`motion/react`)
- **Icons**: Lucide React
- **Markdown**: React Markdown

## Deployment

### GitHub
1. Create a new repository on GitHub.
2. Initialize your local project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Vercel
1. Connect your GitHub repository to Vercel.
2. The `vercel.json` is already configured for a standard Vite build.
3. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
