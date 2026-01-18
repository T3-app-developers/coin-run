import { remoteSocketUrl, resolveVirtualKey } from './utils.js';

export const shouldRenderControllerPage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get('controller') === '1';
};

export const renderControllerPage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const controllerCode = (queryParams.get('code') || '').trim().toUpperCase();
  const wsUrl = controllerCode ? remoteSocketUrl(controllerCode) : 'Missing code';
  document.body.innerHTML = `
    <div id="controller-ui">
      <h1>Remote P2 Controller</h1>
      <p>Connected players listen for <code>{ action, pressed, code }</code> over WebSocket at <code>${wsUrl}</code>.</p>
      <p>${controllerCode ? `Joining code <strong>${controllerCode}</strong>.` : 'Missing a join code. Open the controller link from the host screen.'}</p>
      <div class="controller-grid">
        <button class="controller-btn" data-key="ArrowUp">Jump</button>
        <button class="controller-btn" data-key=".">Attack</button>
        <button class="controller-btn" data-key="/">Mine</button>
        <button class="controller-btn" data-key="ArrowLeft">Left</button>
        <button class="controller-btn" data-key="ArrowRight">Right</button>
        <button class="controller-btn" data-key="[">Wall</button>
        <button class="controller-btn" data-key="]">Lava</button>
        <button class="controller-btn" data-key="r">Restart</button>
        <button class="controller-btn" data-key="h">Hitboxes</button>
      </div>
      <div id="controller-status" class="controller-status">Connecting to ${wsUrl}...</div>
    </div>
  `;
  const statusEl = document.getElementById('controller-status');
  const buttons = Array.from(document.querySelectorAll('.controller-btn'));
  const socket = controllerCode ? new WebSocket(wsUrl) : null;
  const setStatus = (msg) => {
    if (statusEl) statusEl.textContent = msg;
  };
  const sendPayload = (key, pressed) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !controllerCode) return;
    socket.send(JSON.stringify({ action: key, pressed, code: controllerCode }));
  };
  const down = (btn) => {
    btn.classList.add('active');
    sendPayload(resolveVirtualKey(btn.dataset.key), true);
  };
  const up = (btn) => {
    btn.classList.remove('active');
    sendPayload(resolveVirtualKey(btn.dataset.key), false);
  };
  buttons.forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      down(btn);
    });
    btn.addEventListener('pointerup', () => up(btn));
    btn.addEventListener('pointercancel', () => up(btn));
    btn.addEventListener('pointerleave', (e) => {
      if (e.buttons === 0) up(btn);
    });
  });
  if (socket) {
    socket.addEventListener('open', () => setStatus(`Connected to ${wsUrl}. Send inputs to control Player 2.`));
    socket.addEventListener('close', () => setStatus('Connection closed. Reopen this page when the host is ready.'));
    socket.addEventListener('error', () => setStatus('Connection error. Check that the game tab is listening.'));
  } else {
    setStatus('Missing code. Reopen this page from the host link to connect.');
  }
};

export const createNetwork = ({ state, ui, actions }) => {
  const controllerLink = (code) => {
    const basePath = location.pathname.replace(/index\.html$/i, '');
    return `${location.origin}${basePath}controller.html?code=${encodeURIComponent(code)}`;
  };

  const generateRemoteCode = () => {
    const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 4; i += 1) out += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return out;
  };

  const setRemoteStatus = (text, isOnline) => {
    if (ui.remoteStatusEl) {
      ui.remoteStatusEl.textContent = text;
      ui.remoteStatusEl.classList.toggle('offline', !isOnline);
    }
    ui.remoteStatusDisplays.forEach((el) => {
      el.textContent = text;
      el.classList.toggle('offline', !isOnline);
    });
  };

  const setRemoteShareCollapsed = (collapsed) => {
    if (!ui.remoteCard) return;
    ui.remoteCard.classList.toggle('minimized', collapsed);
    if (ui.remoteToggle) ui.remoteToggle.textContent = collapsed ? 'Show QR' : 'Hide QR';
    state.remoteShareCollapsed = collapsed;
  };

  const updateRemoteShareUi = () => {
    if (!ui.remoteCard) return;
    if (!state.remoteMode) {
      ui.remoteCard.classList.add('hidden');
      ui.remoteCard.setAttribute('aria-hidden', 'true');
      return;
    }
    ui.remoteCard.classList.remove('hidden');
    ui.remoteCard.setAttribute('aria-hidden', 'false');
    if (ui.remoteCodeEl) ui.remoteCodeEl.textContent = state.remoteSessionCode || '----';
    const link = controllerLink(state.remoteSessionCode);
    if (ui.remoteLinkEl) ui.remoteLinkEl.href = link;
    if (ui.remoteLinkEl) ui.remoteLinkEl.textContent = link;
    if (ui.remoteQrEl && window.QRCode && state.remoteSessionCode) {
      const qr = new QRCode(state.remoteSessionCode);
      ui.remoteQrEl.src = qr.toDataURL('image/png');
    }
    if (state.remoteShareCollapsed) setRemoteShareCollapsed(true);
  };

  const handleRemotePayload = (payload) => {
    if (!payload) return;
    if (payload.chat) {
      addRemoteMessage(payload.chat, payload.sender || 'P2');
      return;
    }
    if (!payload.action) return;
    const resolved = resolveVirtualKey(payload.action);
    if (payload.pressed) actions.handleKeyDown(resolved);
    else actions.handleKeyUp(resolved);
  };

  const clearRemoteMessages = () => {
    if (ui.remoteMessagesEl) ui.remoteMessagesEl.innerHTML = '';
  };

  const addRemoteMessage = (text, sender = 'P2') => {
    if (!ui.remoteMessagesEl) return;
    const entry = document.createElement('div');
    entry.className = 'remote-message';
    entry.textContent = `${sender}: ${text}`;
    ui.remoteMessagesEl.appendChild(entry);
    ui.remoteMessagesEl.scrollTop = ui.remoteMessagesEl.scrollHeight;
  };

  const sendRemoteChat = (message, sender = 'You') => {
    addRemoteMessage(message, sender);
    if (!state.remoteSocket || state.remoteSocket.readyState !== WebSocket.OPEN) return;
    state.remoteSocket.send(JSON.stringify({ chat: message, sender }));
  };

  const closeRemoteSocket = () => {
    if (!state.remoteSocket) return;
    state.remoteSocket.onopen = null;
    state.remoteSocket.onclose = null;
    state.remoteSocket.onerror = null;
    state.remoteSocket.onmessage = null;
    state.remoteSocket.close();
    state.remoteSocket = null;
  };

  const connectRemoteSocket = () => {
    if (!state.remoteSessionCode) state.remoteSessionCode = generateRemoteCode();
    closeRemoteSocket();
    if (!ui.remoteStatusDisplays.length) return;
    setRemoteStatus('Connecting...', false);
    try {
      state.remoteSocket = new WebSocket(remoteSocketUrl(state.remoteSessionCode));
    } catch (err) {
      setRemoteStatus('WebSocket error', false);
      return;
    }
    state.remoteSocket.onopen = () => {
      state.remoteConnected = true;
      setRemoteStatus('Connected', true);
    };
    state.remoteSocket.onclose = () => {
      state.remoteConnected = false;
      setRemoteStatus('Disconnected', false);
    };
    state.remoteSocket.onerror = () => {
      state.remoteConnected = false;
      setRemoteStatus('WebSocket error', false);
    };
    state.remoteSocket.onmessage = (event) => {
      let data = null;
      try {
        data = JSON.parse(event.data);
      } catch (_) {
        return;
      }
      handleRemotePayload(data);
    };
  };

  const startRemoteSession = (forceNewCode = false) => {
    if (!state.addonsState.remoteEnabled) return;
    if (forceNewCode || !state.remoteSessionCode) state.remoteSessionCode = generateRemoteCode();
    state.remoteKeys = {};
    clearRemoteMessages();
    addRemoteMessage(state.remoteActionHint, 'Tip');
    state.remoteShareAutoCollapsed = false;
    setRemoteShareCollapsed(false);
    updateRemoteShareUi();
    connectRemoteSocket();
  };

  const stopRemoteSession = () => {
    state.remoteKeys = {};
    closeRemoteSocket();
    updateRemoteShareUi();
  };

  if (ui.remoteToggle) {
    ui.remoteToggle.addEventListener('click', () => {
      setRemoteShareCollapsed(!(ui.remoteCard && ui.remoteCard.classList.contains('minimized')));
    });
  }

  return {
    startRemoteSession,
    stopRemoteSession,
    updateRemoteShareUi,
    handleRemotePayload,
    sendRemoteChat,
    setRemoteShareCollapsed,
  };
};
