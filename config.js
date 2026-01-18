(() => {
  const DEFAULTS = Object.freeze({
    REMOTE_WS_BASE: 'wss://free.blr2.piesocket.com/v3',
    REMOTE_WS_KEY: 'demouid',
    REMOTE_CHANNEL_PREFIX: 'coin-run-',
  });

  const params = new URLSearchParams(window.location.search);
  const queryOverrides = {
    wsBase: params.get('wsBase'),
    wsKey: params.get('wsKey'),
    channelPrefix: params.get('channelPrefix'),
  };

  const globalOverrides = (typeof window !== 'undefined' && window.__CONFIG__) ? window.__CONFIG__ : {};

  const pickValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

  const config = {
    REMOTE_WS_BASE: pickValue(
      queryOverrides.wsBase,
      globalOverrides.wsBase,
      globalOverrides.REMOTE_WS_BASE,
      DEFAULTS.REMOTE_WS_BASE,
    ),
    REMOTE_WS_KEY: pickValue(
      queryOverrides.wsKey,
      globalOverrides.wsKey,
      globalOverrides.REMOTE_WS_KEY,
      DEFAULTS.REMOTE_WS_KEY,
    ),
    REMOTE_CHANNEL_PREFIX: pickValue(
      queryOverrides.channelPrefix,
      globalOverrides.channelPrefix,
      globalOverrides.REMOTE_CHANNEL_PREFIX,
      DEFAULTS.REMOTE_CHANNEL_PREFIX,
    ),
  };

  window.APP_CONFIG = Object.freeze(config);
})();
