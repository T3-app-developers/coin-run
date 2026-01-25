# Coin Run

a cool platform game that everyone will enjoy.

## Getting Started

1. Run a local web server in this folder (ES module scripts are blocked when opening files directly):
   - `python3 -m http.server 8080`
   - or `npx serve .`
2. Open `http://localhost:8080/index.html` in your browser.
3. Share the same URL with friends for local play, or use the remote controller setup below.

> **Note:** Most browsers block ES module imports from `file://` URLs. If you open `index.html` directly, the game scripts (including the Play and on-screen buttons) will not load.

### Controls

| Player | Move Left | Move Right | Jump |
| --- | --- | --- | --- |
| P1 | A | D | W |
| P2 | J | L | I |

### Remote Controller

There are two ways to run a phone/controller client:

- Open `controller.html` directly in a browser.
- Open `index.html` with the query parameter `?controller=1`.

The controller connects over WebSocket using the same base URL/key configuration as the main game.

## Architecture

- **UI**: HTML/CSS layouts for the game and controller views.
- **Input**: Keyboard handling for local play and touch input for controller mode.
- **Rendering**: Canvas-based drawing for the game world and UI overlays.
- **Networking**: WebSocket connection for pairing controllers with the game session.

## Configuration

- **WebSocket base URL**: configurable in the JavaScript as the base WebSocket endpoint used by the game/controller.
- **WebSocket key**: configurable in the JavaScript to identify a session.
- **Query parameters**:
  - `controller=1`: launches the controller UI from `index.html`.
  - `code=...`: pairs the controller to a specific game session code.
