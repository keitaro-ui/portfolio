(() => {
  const links = [...document.querySelectorAll('[data-image-preview]')];
  if (links.length) {
    const dialog = document.createElement('dialog');
    dialog.className = 'image-viewer';
    dialog.setAttribute('aria-labelledby', 'viewer-title');
    dialog.innerHTML = '<div class="viewer-toolbar"><h2 id="viewer-title">画像の拡大表示</h2><button type="button" class="viewer-size" aria-pressed="false">等倍表示</button><button type="button" class="viewer-close" autofocus>閉じる ×</button></div><div class="viewer-viewport"><img alt=""></div><p class="viewer-caption"></p>';
    document.body.append(dialog);
    const image = dialog.querySelector('img');
    const viewport = dialog.querySelector('.viewer-viewport');
    const size = dialog.querySelector('.viewer-size');
    let opener;
    links.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      opener = link;
      const original = link.querySelector('img');
      image.src = link.href;
      image.alt = original.alt;
      dialog.querySelector('.viewer-caption').textContent = original.alt;
      viewport.classList.remove('is-actual');
      size.setAttribute('aria-pressed', 'false');
      size.textContent = '等倍表示';
      dialog.showModal();
      document.body.classList.add('image-viewer-open');
      viewport.scrollTop = viewport.scrollLeft = 0;
    }));
    size.addEventListener('click', () => {
      const actual = viewport.classList.toggle('is-actual');
      size.setAttribute('aria-pressed', String(actual));
      size.textContent = actual ? '全体表示' : '等倍表示';
    });
    dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const r = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('image-viewer-open');
      opener?.focus({preventScroll: true});
    });
  }
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    if (!slides.length) return;
    const track = carousel.querySelector('.carousel-track');
    const previous = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const controls = carousel.querySelector('.carousel-controls');
    const dots = carousel.querySelector('.carousel-dots');
    let index = 0;
    const buttons = slides.map((slide, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `画像${i + 1}を表示`);
      button.addEventListener('click', () => show(i));
      dots.append(button);
      return button;
    });
    function show(value) {
      index = Math.max(0, Math.min(slides.length - 1, value));
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', String(i !== index));
        slide.inert = i !== index;
        buttons[i].setAttribute('aria-current', String(i === index));
      });
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      carousel.querySelector('.carousel-count').textContent = `${index + 1} / ${slides.length}`;
    }
    previous.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    carousel.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const actions = {ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1};
      if (event.key in actions) { event.preventDefault(); show(actions[event.key]); }
    });
    carousel.classList.add('is-enhanced');
    controls.hidden = false;
    show(0);
  });
})();
