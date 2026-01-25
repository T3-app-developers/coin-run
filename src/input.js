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
      actions.applyAddonsState({ localMultiplayerEnabled: false, remoteEnabled: false }, { showBiome: true });
      return;
    }
    if (e.key === '2') {
      actions.applyAddonsState({ localMultiplayerEnabled: true }, { showBiome: true });
      return;
    }
    if (e.key === '3') {
      actions.applyAddonsState({ remoteEnabled: true }, { showBiome: true });
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
