const VIRTUAL_KEY_ALIASES = {
  space: ' ',
  Space: ' ',
};

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const rand = (a, b) => Math.random() * (b - a) + a;
export const irand = (a, b) => Math.floor(rand(a, b));
export const sign = (x) => (x < 0 ? -1 : 1);

export const hexToRgb = (hex) => {
  if (!hex) return { r: 0, g: 0, b: 0 };
  const clean = hex.replace('#', '');
  const expanded = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const value = parseInt(expanded, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

export const mixHex = (from, to, t) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const mix = (v1, v2) => Math.round(v1 + (v2 - v1) * t);
  return `rgb(${mix(a.r, b.r)}, ${mix(a.g, b.g)}, ${mix(a.b, b.b)})`;
};

export const hexToRgba = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const formatTime = (sec) => {
  const totalTenths = Math.round(sec * 10);
  const minutes = Math.floor(totalTenths / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
};

export const resolveVirtualKey = (raw) => {
  if (!raw) return raw;
  return Object.prototype.hasOwnProperty.call(VIRTUAL_KEY_ALIASES, raw) ? VIRTUAL_KEY_ALIASES[raw] : raw;
};
