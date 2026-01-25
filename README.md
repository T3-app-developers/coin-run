# Coin Run

a cool platform game that everyone will enjoy.

## Getting Started

1. Run a local web server in this folder (ES module scripts are blocked when opening files directly):
   - `python3 -m http.server 8080`
   - or `npx serve .`
2. Open `http://localhost:8080/index.html` in your browser.
3. Share the same URL with friends for local play.

> **Note:** Most browsers block ES module imports from `file://` URLs. If you open `index.html` directly, the game scripts (including the Play and on-screen buttons) will not load.

### Controls

| Player | Move Left | Move Right | Jump |
| --- | --- | --- | --- |
| P1 | A | D | W |
| P2 | J | L | I |

## Architecture

- **UI**: HTML/CSS layouts for the game.
- **Input**: Keyboard handling for local play and touch input for mobile mode.
- **Rendering**: Canvas-based drawing for the game world and UI overlays.
