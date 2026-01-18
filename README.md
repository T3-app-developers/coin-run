# Coin Run

a cool platform game that everyone will enjoy.

## Getting Started

1. Open `index.html` in your browser (double-click the file or use `File > Open...`).
2. Share the same file with friends for local play, or use the remote controller setup below.

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
