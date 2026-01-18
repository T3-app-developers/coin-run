import { initGame } from './game.js';
import { shouldRenderControllerPage, renderControllerPage } from './network.js';

if (shouldRenderControllerPage()) {
  renderControllerPage();
} else {
  initGame();
}
