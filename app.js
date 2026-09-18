(() => {
  const canvas = document.querySelector('.word-portrait');
  const ctx = canvas.getContext('2d', { alpha: false });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Edit this single list to change the vocabulary across the page.
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

  function seeded(index) {
    const x = Math.sin(index * 999.91 + 17.3) * 43758.5453;
    return x - Math.floor(x);
  }

  function build() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const mobile = width < 760;
    const stepY = mobile ? 14 : 18;
    const fontSize = mobile ? 9 : 12;
    tiles = [];
    let index = 0;

    for (let y = 5; y < height + stepY; y += stepY) {
      let x = (Math.floor(y / stepY) % 2) * -34;
      while (x < width) {
        const word = words[index % words.length];
        const approxWidth = word.length * fontSize * 0.63 + 10;
        tiles.push({
          x,
          y,
          word,
          size: fontSize + (seeded(index + 4) > 0.86 ? 1 : 0),
          shade: 0.22 + seeded(index) * 0.7,
          phase: seeded(index + 9) * Math.PI * 2,
          accent: index % 47 === 0
        });
        x += approxWidth;
        index += 1;
      }
    }
  }

  function draw(time = 0) {
    const t = reducedMotion ? 0 : time * 0.001;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#ebe9e3';
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'middle';

    for (let i = 0; i < tiles.length; i += 1) {
      const tile = tiles[i];
      const alpha = tile.shade;

      ctx.font = `500 ${tile.size}px "IBM Plex Mono", monospace`;
      ctx.fillStyle = tile.accent && Math.sin(t * 0.7 + tile.phase) > 0.75
        ? `rgba(216,47,39,${alpha})`
        : `rgba(21,21,21,${alpha})`;
      ctx.fillText(tile.word, tile.x, tile.y);
    }

    if (!reducedMotion) requestAnimationFrame(draw);
  }

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
