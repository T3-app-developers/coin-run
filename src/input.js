export const setupInput = ({
  state,
  ui,
  actions,
  resolveVirtualKey,
}) => {
  const isTypingTarget = (el) => {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  };

  const clearVirtualInputs = () => {
    state.virtualButtons.forEach(({ btn, key }) => {
      btn.classList.remove('active');
      state.inputSources.virtual.delete(key);
      actions.recomputeKey(key);
    });
  };

  const enableTouchControls = () => {
    if (state.initFailed) return;
    if (!ui.touchControls) return;
    ui.touchControls.classList.remove('hidden');
    const buttons = Array.from(ui.touchControls.querySelectorAll('.touch-btn'));
    buttons.forEach((btn) => {
      const resolvedKey = resolveVirtualKey(btn.dataset.key);
      const entry = { btn, key: resolvedKey };
      state.virtualButtons.push(entry);
      const press = (e) => {
        if (e) {
          e.preventDefault();
          if (btn.setPointerCapture) btn.setPointerCapture(e.pointerId);
        }
        btn.classList.add('active');
        actions.handleKeyDown(resolvedKey, 'virtual');
      };
      const release = (e) => {
        if (e && btn.releasePointerCapture && btn.hasPointerCapture && btn.hasPointerCapture(e.pointerId)) {
          btn.releasePointerCapture(e.pointerId);
        }
        btn.classList.remove('active');
        actions.handleKeyUp(resolvedKey, 'virtual');
      };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', (e) => {
        if (e.buttons === 0) release(e);
      });
      btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });
    window.addEventListener('blur', clearVirtualInputs);
  };

  window.addEventListener('keydown', (e) => {
    if (!state.platformMode) return;
    if (isTypingTarget(e.target)) return;
    if (e.key === '1') {
      actions.applyAddonsState({ localMultiplayerEnabled: false }, { showBiome: true });
      return;
    }
    if (e.key === '2') {
      actions.applyAddonsState({ localMultiplayerEnabled: true }, { showBiome: true });
      return;
    }
    const chatTarget = Object.values(ui.chatLanes).some(({ input }) => input && input === e.target);
    const chatHidden = !ui.chatUi || ui.chatUi.classList.contains('hidden');
    if (chatHidden === false) {
      const wantsP1 = state.chatHotkeys.p1.includes(e.key);
      const wantsP2 = state.chatHotkeys.p2.includes(e.key);
      if (wantsP1 || (wantsP2 && actions.shouldShowSecondPlayer())) {
        e.preventDefault();
        actions.focusChat(wantsP1 ? 'p1' : 'p2');
        return;
      }
    }
    if (state.activeChatPlayer || chatTarget) {
      if (e.key === 'Escape') actions.closeChatInput();
      return;
    }
    actions.handleKeyDown(e.key);
  });

  window.addEventListener('keyup', (e) => {
    if (!state.platformMode || !state.gameMode) return;
    if (isTypingTarget(e.target)) return;
    actions.handleKeyUp(e.key);
  });

  return {
    enableTouchControls,
    clearVirtualInputs,
  };
};
