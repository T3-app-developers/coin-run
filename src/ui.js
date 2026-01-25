export const createUI = () => {
  const canvas = document.getElementById('game');
  const ui = {
    p1: {
      coins: document.getElementById('p1-coins'),
      wood: document.getElementById('p1-wood'),
      lives: document.getElementById('p1-lives'),
      gun: document.getElementById('p1-gun'),
    },
    p2: {
      coins: document.getElementById('p2-coins'),
      wood: document.getElementById('p2-wood'),
      lives: document.getElementById('p2-lives'),
      gun: document.getElementById('p2-gun'),
    },
  };
  const uiLevel = document.getElementById('level-indicator');
  const uiTimer = document.getElementById('timer');
  const uiLavaStatus = document.getElementById('lava');
  const overlay = document.getElementById('overlay');
  const overlayCard = document.getElementById('overlay-card');
  const celebrationScreen = document.getElementById('celebration-screen');
  const celebrationTitle = document.getElementById('celebration-title');
  const celebrationSummary = document.getElementById('celebration-summary');
  const celebrationDetails = document.getElementById('celebration-details');
  const celebrationNext = document.getElementById('celebration-next');
  const platformSelect = document.getElementById('platform-select');
  const platformButtons = platformSelect ? platformSelect.querySelectorAll('.platform-btn') : [];
  const modeSelect = document.getElementById('mode-select');
  const modeButtons = modeSelect ? modeSelect.querySelectorAll('.mode-btn') : [];
  const biomeSelect = document.getElementById('biome-select');
  const biomeButtonsWrap = document.getElementById('biome-buttons');
  const biomeBlurb = document.getElementById('biome-blurb');
  const biomeTitle = document.getElementById('biome-title');
  const biomeFeatures = document.getElementById('biome-features');
  const biomeBoss = document.getElementById('biome-boss');
  const touchControls = document.getElementById('touch-controls');
  const helpP2 = document.getElementById('help-p2');
  const helpPanel = document.getElementById('help');
  const helpToggle = document.getElementById('help-toggle');
  const p2Pills = Array.from(document.querySelectorAll('.p2-pill'));
  const biomeTip = document.getElementById('biome-tip');
  const remoteTip = document.getElementById('remote-tip');
  const remoteCard = document.getElementById('remote-share');
  const remoteToggle = document.getElementById('remote-toggle');
  const remoteCodeEl = document.getElementById('remote-code');
  const remoteLinkEl = document.getElementById('remote-link');
  const remoteQrEl = document.getElementById('remote-qr');
  const remoteStatusEl = document.getElementById('remote-status');
  const remoteRefreshBtn = document.getElementById('remote-refresh');
  const addonsButton = document.getElementById('addons-button');
  const addonsPanel = document.getElementById('addons-panel');
  const addonsClose = document.getElementById('addons-close');
  const addonsLocalToggle = document.getElementById('addon-local');
  const addonsRemoteToggle = document.getElementById('addon-remote');
  const addonsDisplayToggle = document.getElementById('addon-display');
  const resourceLabels = {
    p1: document.getElementById('p1-resource-label'),
    p2: document.getElementById('p2-resource-label'),
  };
  const deathScreen = document.getElementById('death-screen');
  const wahAudio = document.getElementById('wah-audio');
  const bossIndicator = document.getElementById('boss-indicator');
  const bossLabel = document.getElementById('boss-label');
  const bossHealthFill = document.getElementById('boss-health-fill');
  const bossHealthText = document.getElementById('boss-health-text');
  const upgradePill = document.getElementById('upgrade-pill');
  const upgradeText = document.getElementById('upgrade-text');
  const welcomeScreen = document.getElementById('welcome-screen');
  const welcomePlayBtn = document.getElementById('welcome-play');
  const welcomeSettingsBtn = document.getElementById('welcome-settings');
  const addonsToggle = document.getElementById('addons-toggle');
  const ovTitle = document.getElementById('ov-title');
  const ovBody = document.getElementById('ov-body');
  const remoteStatusDisplays = Array.from(document.querySelectorAll('.remote-status-display'));

  if (wahAudio) wahAudio.volume = 0.55;

  return {
    canvas,
    ui,
    uiLevel,
    uiTimer,
    uiLavaStatus,
    overlay,
    overlayCard,
    celebrationScreen,
    celebrationTitle,
    celebrationSummary,
    celebrationDetails,
    celebrationNext,
    platformSelect,
    platformButtons,
    modeSelect,
    modeButtons,
    biomeSelect,
    biomeButtonsWrap,
    biomeBlurb,
    biomeTitle,
    biomeFeatures,
    biomeBoss,
    touchControls,
    helpP2,
    helpPanel,
    helpToggle,
    p2Pills,
    biomeTip,
    remoteTip,
    remoteCard,
    remoteToggle,
    remoteCodeEl,
    remoteLinkEl,
    remoteQrEl,
    remoteStatusEl,
    remoteRefreshBtn,
    addonsButton,
    addonsPanel,
    addonsClose,
    addonsLocalToggle,
    addonsRemoteToggle,
    addonsDisplayToggle,
    resourceLabels,
    deathScreen,
    wahAudio,
    bossIndicator,
    bossLabel,
    bossHealthFill,
    bossHealthText,
    upgradePill,
    upgradeText,
    welcomeScreen,
    welcomePlayBtn,
    welcomeSettingsBtn,
    addonsToggle,
    ovTitle,
    ovBody,
    remoteStatusDisplays,
  };
};
