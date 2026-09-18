(() => {
  const canvas = document.querySelector('.word-portrait');
  const ctx = canvas.getContext('2d', { alpha: false });
  const mask = document.createElement('canvas');
  const maskCtx = mask.getContext('2d', { willReadFrequently: true });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Edit this single list to change the vocabulary across the portrait.
  const words = [
    'LIBERTAD', 'IMPUESTOS', 'CORRUPCIÓN', 'IMPUNIDAD', 'NEPOTISMO',
    'JUSTICIA', 'PODER', 'VERDAD', 'CIUDADANÍA', 'DEMOCRACIA',
    'TRANSPARENCIA', 'PRIVILEGIOS', 'CENSURA', 'IGUALDAD', 'SOBERANÍA',
    'DERECHOS', 'ABUSO', 'INSTITUCIONES', 'RESPONSABILIDAD',
    'PARTICIPACIÓN', 'FUTURO', 'MEMORIA', 'DIGNIDAD', 'CAMBIO'
  ];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let tiles = [];
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;

  function seeded(index) {
    const x = Math.sin(index * 999.91 + 17.3) * 43758.5453;
    return x - Math.floor(x);
  }

  function portraitPath(g, w, h) {
    const mobile = w < 760;
    const scale = Math.min(w, h) * (mobile ? 0.76 : 0.98);
    const ox = mobile ? w * 0.5 : w * 0.73;
    const oy = mobile ? h * 0.28 : h * 0.5;

    g.save();
    g.translate(ox, oy);
    g.scale(scale / 720, scale / 720);
    g.beginPath();
    // Abstract right-facing human profile and shoulders.
    g.moveTo(-206, 328);
    g.bezierCurveTo(-278, 252, -288, 154, -265, 72);
    g.bezierCurveTo(-242, -14, -226, -128, -144, -218);
    g.bezierCurveTo(-75, -294, 51, -331, 150, -286);
    g.bezierCurveTo(221, -253, 245, -188, 250, -116);
    g.bezierCurveTo(253, -78, 277, -51, 308, -12);
    g.bezierCurveTo(325, 9, 308, 29, 275, 37);
    g.bezierCurveTo(265, 63, 267, 82, 283, 105);
    g.bezierCurveTo(267, 117, 260, 128, 272, 144);
    g.bezierCurveTo(259, 157, 254, 172, 258, 192);
    g.bezierCurveTo(268, 239, 222, 262, 165, 252);
    g.bezierCurveTo(124, 245, 96, 255, 84, 287);
    g.bezierCurveTo(75, 311, 76, 338, 83, 362);
    g.lineTo(-206, 362);
    g.closePath();
    g.fill();

    // Neck and shoulder mass makes the portrait read from a distance.
    g.beginPath();
    g.moveTo(-92, 188);
    g.bezierCurveTo(-75, 283, -150, 292, -258, 328);
    g.lineTo(-340, 410);
    g.lineTo(286, 410);
    g.bezierCurveTo(224, 323, 155, 289, 94, 269);
    g.lineTo(84, 190);
    g.closePath();
    g.fill();

    // Eye and mouth cut-outs keep the silhouette human.
    g.globalCompositeOperation = 'destination-out';
    g.beginPath();
    g.ellipse(126, -83, 34, 10, -0.15, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(216, 112, 35, 5, 0.1, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  function build() {
    width = window.innerWidth;
    height = Math.max(window.innerHeight, 650);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    mask.width = Math.round(width);
    mask.height = Math.round(height);

    maskCtx.clearRect(0, 0, width, height);
    maskCtx.fillStyle = '#000';
    portraitPath(maskCtx, width, height);

    const sample = maskCtx.getImageData(0, 0, width, height).data;
    const mobile = width < 760;
    const stepY = mobile ? 12 : 15;
    const fontSize = mobile ? 8 : 10;
    tiles = [];
    let index = 0;

    for (let y = 4; y < height; y += stepY) {
      let x = (Math.floor(y / stepY) % 2) * -23;
      while (x < width) {
        const word = words[index % words.length];
        const approxWidth = word.length * fontSize * 0.63 + 8;
        const cx = Math.max(0, Math.min(width - 1, Math.round(x + approxWidth / 2)));
        const cy = Math.max(0, Math.min(height - 1, Math.round(y)));
        const alpha = sample[(cy * width + cx) * 4 + 3];
        if (alpha > 20) {
          const shade = 0.26 + seeded(index) * 0.62;
          tiles.push({
            x,
            y,
            word,
            size: fontSize + (seeded(index + 4) > 0.86 ? 1 : 0),
            shade,
            phase: seeded(index + 9) * Math.PI * 2,
            accent: index % 47 === 0
          });
        }
        x += approxWidth;
        index += 1;
      }
    }
  }

  function draw(time = 0) {
    frame += 1;
    const t = reducedMotion ? 0 : time * 0.001;
    const zoom = reducedMotion ? 1.02 : 1.035 + Math.sin(t * 0.22) * 0.035;
    const driftX = reducedMotion ? 0 : Math.sin(t * 0.18) * 17 + pointerX * 9;
    const driftY = reducedMotion ? 0 : Math.cos(t * 0.15) * 10 + pointerY * 7;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#ebe9e3';
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2 + driftX, height / 2 + driftY);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);
    ctx.textBaseline = 'middle';

    for (let i = 0; i < tiles.length; i += 1) {
      const tile = tiles[i];
      const breathe = reducedMotion ? 0 : Math.sin(t * 0.75 + tile.phase) * 0.055;
      const flash = !reducedMotion && (Math.floor(t / 2.6) % words.length) === (i % words.length);
      const alpha = Math.min(0.94, tile.shade + breathe + (flash ? 0.2 : 0));
      ctx.font = `${flash ? 600 : 500} ${tile.size}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = tile.accent && Math.sin(t * 0.7 + tile.phase) > 0.75
        ? `rgba(216,47,39,${alpha})`
        : `rgba(21,21,21,${alpha})`;
      ctx.fillText(tile.word, tile.x, tile.y);
    }

    ctx.restore();
    if (!reducedMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX / Math.max(width, 1) - 0.5;
    pointerY = event.clientY / Math.max(height, 1) - 0.5;
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      if (reducedMotion) draw();
    }, 120);
  });

  document.fonts.ready.then(() => {
    build();
    draw();
  });
})();
