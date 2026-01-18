export const createRenderer = ({ state }) => {
  const drawGround = () => {
    const { ctx, camX, W, H } = state;
    const palette = state.activeBiome && state.activeBiome.palette ? state.activeBiome.palette : state.baseBiome.palette;
    ctx.save();
    ctx.translate(-camX, 0);
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, palette.skyTop || '#6ec6ff');
    skyGrad.addColorStop(1, palette.skyBottom || '#bfeaff');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(camX, 0, W, H);

    ctx.fillStyle = palette.hillColor || '#9ed39b';
    ctx.beginPath();
    ctx.moveTo(camX, state.groundY - 120);
    for (let x = camX; x < camX + W + 40; x += 120) {
      ctx.quadraticCurveTo(x + 60, state.groundY - 160, x + 120, state.groundY - 120);
    }
    ctx.lineTo(camX + W, H);
    ctx.lineTo(camX, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#78b97a';
    ctx.beginPath();
    ctx.moveTo(camX, state.groundY - 60);
    for (let x = camX; x < camX + W + 40; x += 100) {
      ctx.quadraticCurveTo(x + 50, state.groundY - 110, x + 100, state.groundY - 60);
    }
    ctx.lineTo(camX + W, H);
    ctx.lineTo(camX, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = palette.turfTop || '#90e084';
    ctx.fillRect(camX, state.groundY - 8, W, 8);
    const groundGrad = ctx.createLinearGradient(0, state.groundY, 0, H);
    groundGrad.addColorStop(0, palette.turfMid || '#66ba5d');
    groundGrad.addColorStop(1, palette.turfBottom || '#447d3d');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(camX, state.groundY, W, H - state.groundY);

    ctx.strokeStyle = palette.edge || '#2f4f2d';
    ctx.lineWidth = 2;
    for (let x = camX; x < camX + W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, state.groundY + 16);
      ctx.lineTo(x + 20, state.groundY + 12);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawBackdrop = () => {
    const { ctx, camX, W } = state;
    const palette = state.activeBiome && state.activeBiome.palette ? state.activeBiome.palette : state.baseBiome.palette;
    ctx.save();
    ctx.translate(-camX, 0);
    const silhouetteColor = palette.silhouetteColor || '#2f6130';
    ctx.fillStyle = silhouetteColor;
    const type = palette.silhouetteType || 'trees';
    if (type === 'city') {
      for (let x = camX; x < camX + W + 80; x += 80) {
        const height = 90 + (x % 160);
        ctx.fillRect(x, state.groundY - 120, 42, height);
        ctx.fillRect(x + 20, state.groundY - 140, 52, height + 20);
      }
    } else if (type === 'dunes') {
      ctx.beginPath();
      ctx.moveTo(camX, state.groundY - 40);
      for (let x = camX; x < camX + W + 60; x += 120) {
        ctx.quadraticCurveTo(x + 60, state.groundY - 80, x + 120, state.groundY - 40);
      }
      ctx.lineTo(camX + W, state.groundY);
      ctx.lineTo(camX, state.groundY);
      ctx.closePath();
      ctx.fill();
    } else if (type === 'kelp') {
      for (let x = camX; x < camX + W + 60; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, state.groundY);
        ctx.quadraticCurveTo(x + 10, state.groundY - 60, x + 20, state.groundY - 120);
        ctx.quadraticCurveTo(x + 25, state.groundY - 140, x + 30, state.groundY - 180);
        ctx.lineTo(x + 35, state.groundY - 180);
        ctx.closePath();
        ctx.fill();
      }
    } else if (type === 'craters') {
      for (let x = camX; x < camX + W + 120; x += 140) {
        ctx.beginPath();
        ctx.arc(x + 40, state.groundY - 20, 30, 0, Math.PI);
        ctx.fill();
      }
    } else {
      for (let x = camX; x < camX + W + 60; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, state.groundY);
        ctx.lineTo(x + 12, state.groundY - 60);
        ctx.lineTo(x + 24, state.groundY);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  };

  const drawVolcano = (v) => {
    if (!v || !state.activeBiome) return;
    const palette = state.activeBiome.palette || state.baseBiome.palette;
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    ctx.fillStyle = palette.hazardBodyMid;
    for (let i = 0; i < v.steps; i += 1) {
      const stepY = v.y + (v.steps - i - 1) * v.stepHeight;
      const stepW = (i + 1) * state.tile * 2;
      ctx.fillRect(v.x + (v.steps - i - 1) * state.tile, stepY, stepW, v.stepHeight);
    }
    ctx.fillStyle = palette.hazardBodyDark;
    ctx.fillRect(v.craterX, v.craterY, v.craterWidth, v.craterDepth);
    ctx.fillStyle = palette.hazardLipLight;
    ctx.fillRect(v.craterX - v.rimWidth, v.rimY - 6, v.craterWidth + v.rimWidth * 2, v.rimWidth);

    ctx.fillStyle = palette.hazardGlow;
    ctx.fillRect(v.craterX, v.lavaY, v.craterWidth, v.lavaHeight);
    if (v.erupting) {
      ctx.fillStyle = palette.hazardRimGlow;
      ctx.globalAlpha = Math.min(1, v.eruptProgress / 30);
      ctx.fillRect(v.craterX - v.rimWidth, v.rimY - 6, v.craterWidth + v.rimWidth * 2, v.rimWidth);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  };

  const drawTree = (tr) => {
    if (tr.dead) return;
    const palette = tr.palette || (state.activeBiome ? state.activeBiome.palette : state.baseBiome.palette);
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    ctx.fillStyle = palette.resourceTrunk || '#7c4f2a';
    ctx.fillRect(tr.x + tr.w / 2 - 4, tr.y + 8, 8, tr.h - 8);
    ctx.fillStyle = palette.resourceCanopy || '#3a7d3a';
    ctx.beginPath();
    ctx.arc(tr.x + tr.w / 2, tr.y + 8, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawWall = (w) => {
    const palette = state.activeBiome && state.activeBiome.palette ? state.activeBiome.palette : state.baseBiome.palette;
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    ctx.fillStyle = palette.wallPrimary || '#9399a3';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = palette.wallStroke || '#747b85';
    ctx.strokeRect(w.x, w.y, w.w, w.h);
    ctx.restore();
  };

  const drawLava = (l) => {
    const palette = l.palette || (state.activeBiome && state.activeBiome.palette ? state.activeBiome.palette : state.baseBiome.palette);
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    ctx.fillStyle = palette.lavaFillMid || '#ff6b3a';
    ctx.fillRect(l.x, l.y, l.w, l.h);
    ctx.strokeStyle = palette.lavaStroke || '#ffd166';
    ctx.strokeRect(l.x, l.y, l.w, l.h);
    ctx.restore();
  };

  const drawCoin = (c) => {
    const palette = state.activeBiome && state.activeBiome.palette ? state.activeBiome.palette : state.baseBiome.palette;
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    ctx.fillStyle = palette.coinPrimary || '#ffd166';
    const bounce = Math.sin(c.t) * 3;
    ctx.beginPath();
    ctx.arc(c.x, c.y + bounce, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.coinEdge || '#c9a44f';
    ctx.stroke();
    ctx.restore();
    c.t += 0.1;
  };

  const drawBoss = (enemy) => {
    const palette = state.activeBiome && state.activeBiome.palette ? state.activeBiome.palette : state.baseBiome.palette;
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    ctx.fillStyle = palette.bossBody || '#32713b';
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    ctx.fillStyle = palette.bossBelly || '#4ca254';
    ctx.fillRect(enemy.x + enemy.w * 0.25, enemy.y + enemy.h * 0.35, enemy.w * 0.5, enemy.h * 0.45);
    ctx.fillStyle = palette.bossHead || '#3c8f48';
    ctx.fillRect(enemy.x + enemy.w * 0.1, enemy.y - enemy.h * 0.2, enemy.w * 0.8, enemy.h * 0.4);
    ctx.fillStyle = palette.bossEyeDark || '#1c2b16';
    ctx.fillRect(enemy.x + enemy.w * 0.2, enemy.y - enemy.h * 0.05, 6, 4);
    ctx.fillRect(enemy.x + enemy.w * 0.6, enemy.y - enemy.h * 0.05, 6, 4);
    ctx.restore();
  };

  const drawShadow = (x, y, w, h, intensity, skew) => {
    const { ctx } = state;
    ctx.save();
    ctx.globalAlpha = intensity;
    ctx.fillStyle = '#0008';
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + skew, y + h, w / 2, h / 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawEnemy = (enemy) => {
    if (enemy.dead) return;
    if (enemy instanceof state.Boss) {
      drawBoss(enemy);
      return;
    }
    const palette = state.activeBiome && state.activeBiome.palette ? state.activeBiome.palette : state.baseBiome.palette;
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    drawShadow(enemy.x, enemy.y, enemy.w, enemy.h, 0.4, 0);
    ctx.fillStyle = palette.enemyPrimary || '#7f3232';
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    ctx.fillStyle = palette.enemySecondary || '#c54c4c';
    ctx.fillRect(enemy.x + 6, enemy.y + 6, enemy.w - 12, enemy.h - 12);
    ctx.restore();
  };

  const drawBullet = (bullet) => {
    const palette = state.activeBiome && state.activeBiome.palette ? state.activeBiome.palette : state.baseBiome.palette;
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    ctx.fillStyle = palette.bulletPrimary || '#ff9e64';
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    ctx.restore();
  };

  const drawPlayer = (player) => {
    const { ctx, camX } = state;
    ctx.save();
    ctx.translate(-camX, 0);
    ctx.fillStyle = player.bodyColor || '#2f3b52';
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.fillStyle = player.color || '#2fd06c';
    const head = { x: player.x - 2, y: player.y - 12, s: player.w + 4 };
    ctx.fillRect(head.x, head.y, head.s, head.s);

    if (player.spawnShield > 0) {
      ctx.strokeStyle = '#9ef79a';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      ctx.strokeRect(player.x - 4, player.y - 6, player.w + 8, player.h + 8);
      ctx.globalAlpha = 1;
    }

    if (state.debugShowHit) {
      ctx.strokeStyle = '#fff4';
      ctx.strokeRect(player.x, player.y, player.w, player.h);
      ctx.strokeStyle = '#0f08';
      ctx.strokeRect(head.x, head.y, head.s, head.s);
    }

    ctx.restore();
  };

  const draw = () => {
    const { ctx, W, H } = state;
    ctx.clearRect(0, 0, W, H);
    drawGround();
    drawBackdrop();

    drawVolcano(state.volcano);
    state.trees.forEach(drawTree);
    state.walls.forEach(drawWall);
    state.lavas.forEach(drawLava);
    state.coins.forEach(drawCoin);
    state.enemies.forEach(drawEnemy);
    state.players.forEach(drawPlayer);
    state.bullets.forEach(drawBullet);

    ctx.save();
    ctx.translate(-state.camX, 0);
    ctx.strokeStyle = '#ffffff20';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(state.goalX, 0);
    ctx.lineTo(state.goalX, H);
    ctx.stroke();
    ctx.restore();
  };

  return {
    draw,
  };
};
