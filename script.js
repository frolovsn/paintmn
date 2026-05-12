document.addEventListener('DOMContentLoaded', () => {
  // ========================================
  // ОБЩИЕ ЭЛЕМЕНТЫ
  // ========================================
  const grid = document.getElementById('portfolio-grid');
  const filtersContainer = document.getElementById('portfolio-filters');
  const subFiltersContainer = document.getElementById('portfolio-subfilters');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');

  let currentItems = [...portfolioData];
  let displayedItems = [];
  let currentIndex = 0;
  let lightboxContext = 'portfolio';
  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;
  let isAllLoaded = false;

  const categoryNames = {
    cityscape: 'Городской пейзаж', portrait: 'Портрет', mythopoetics: 'Мифопоэтика',
    'still-life': 'Натюрморт', genre: 'Сюжетная картина', animals: 'Анималистика',
    pastel_charcoal: 'Пастель, уголь', watercolor: 'Акварель', ink_liner: 'Тушь, линер'
  };

  const subCategories = {
    painting: ['cityscape', 'portrait', 'mythopoetics', 'still-life', 'genre', 'animals'],
    graphics: ['pastel_charcoal', 'watercolor', 'ink_liner']
  };

  // ========================================
  // 1. ПОРТФОЛИО — ФИЛЬТРЫ
  // ========================================
  ['all', 'painting', 'graphics'].forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat === 'all' ? 'active' : ''}`;
    btn.dataset.category = cat;
    btn.textContent = cat === 'all' ? 'Все работы' : cat === 'painting' ? 'Живопись' : 'Графика';
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyMainFilter(cat);
    });
    filtersContainer.appendChild(btn);
  });

  function applyMainFilter(mainCat) {
    subFiltersContainer.innerHTML = '';
    subFiltersContainer.classList.remove('visible');
    currentPage = 1;
    isAllLoaded = false;

    if (mainCat === 'all') {
      currentItems = portfolioData;
      renderPortfolio();
    } else {
      subCategories[mainCat].forEach(subCat => {
        const subBtn = document.createElement('button');
        subBtn.className = 'sub-filter-btn';
        subBtn.dataset.sub = subCat;
        subBtn.textContent = categoryNames[subCat];
        subBtn.addEventListener('click', () => {
          document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
          subBtn.classList.add('active');
          currentItems = portfolioData.filter(i => i.type === mainCat && i.category === subCat);
          currentPage = 1;
          isAllLoaded = false;
          renderPortfolio();
        });
        subFiltersContainer.appendChild(subBtn);
      });
      subFiltersContainer.classList.add('visible');
      currentItems = portfolioData.filter(i => i.type === mainCat);
      renderPortfolio();
    }
  }

  // ========================================
  // 2. ПОРТФОЛИО — РЕНДЕР
  // ========================================
  function renderPortfolio(append = false) {
    if (!append) {
      grid.innerHTML = '';
      displayedItems = [];
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = isAllLoaded ? currentItems.length : start + ITEMS_PER_PAGE;
    const toShow = currentItems.slice(start, end);

    toShow.forEach(item => {
      const el = document.createElement('div');
      el.className = `portfolio-item ${append ? 'visible' : ''}`;
      const idx = displayedItems.length;
      el.dataset.index = idx;
      el.innerHTML = `
        <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='https://placehold.co/600x800/e0e0e0/888?text=Нет+изображения'">
        <div class="item-overlay">
          <div class="item-title">${item.title}</div>
          <div class="item-meta">${item.year} • ${categoryNames[item.category] || item.category}</div>
        </div>`;
      el.addEventListener('click', () => openLightbox('portfolio', idx));
      grid.appendChild(el);
      displayedItems.push(item);
    });

    if (!append) observeElements();
    updateLoadMoreBtn();
  }

  function updateLoadMoreBtn() {
    const hasMore = displayedItems.length < currentItems.length;
    loadMoreBtn.classList.toggle('hidden', !hasMore && !isAllLoaded);
    loadMoreBtn.textContent = isAllLoaded ? 'Все работы загружены' : 'Показать ещё работы';
  }

  // "Показать ещё" — загружает ВЕСЬ оставшийся каталог
  loadMoreBtn.addEventListener('click', () => {
    if (!isAllLoaded) {
      isAllLoaded = true;
      renderPortfolio(true);
    }
  });

  // ========================================
  // 3. STICKY КНОПКА "СВЕРНУТЬ" ДЛЯ ПОРТФОЛИО
  // ========================================
  const portfolioCollapseBtn = document.querySelector('[data-section="portfolio"]');
  const portfolioContent = document.getElementById('portfolio-content');

  if (portfolioCollapseBtn && portfolioContent) {
    portfolioCollapseBtn.addEventListener('click', () => {
      const isCollapsed = portfolioContent.classList.toggle('collapsed');
      portfolioCollapseBtn.textContent = isCollapsed ? 'Развернуть ▼' : 'Свернуть ▲';

      if (isCollapsed) {
        // Свернуть — возвращаем к начальному состоянию
        currentPage = 1;
        isAllLoaded = false;
        displayedItems = [];
        renderPortfolio(false);
        // Сбрасываем фильтры на "Все работы"
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        subFiltersContainer.innerHTML = '';
        subFiltersContainer.classList.remove('visible');
        currentItems = portfolioData;
      }
    });

    // IntersectionObserver для sticky-кнопки
    const portfolioSection = document.getElementById('portfolio');
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    portfolioSection.style.position = 'relative';
    portfolioSection.insertBefore(sentinel, portfolioSection.firstChild);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          portfolioCollapseBtn.classList.add('is-sticky');
        } else {
          portfolioCollapseBtn.classList.remove('is-sticky');
        }
      });
    }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });

    observer.observe(sentinel);
  }

  // ========================================
  // 4. LIGHTBOX (унифицированный)
  // ========================================
  let currentLightboxItems = [];
  function openLightbox(context, index) {
    lightboxContext = context;
    currentLightboxItems = context === 'portfolio' ? displayedItems : 
                          context === 'diplomas' ? diplomasData : newsData;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function updateLightbox() {
    const item = currentLightboxItems[currentIndex];
    if (!item) return;

    if (lightboxContext === 'news' && item.type === 'video') {
      // Для видео показываем poster или заменяем на видео
      lightboxImg.src = item.src;
      lightboxImg.style.display = 'none';
      // Можно добавить video элемент при необходимости
    } else {
      lightboxImg.src = item.image || item.src;
      lightboxImg.style.display = 'block';
    }

    lightboxImg.alt = item.title || item.alt;
    lightboxTitle.textContent = item.title || item.alt;
    lightboxDesc.textContent = item.year ? `${item.year} • ${item.description}` : 
                                item.description || item.date || '';
  }
  function navigateLightbox(dir) {
    currentIndex = (currentIndex + dir + currentLightboxItems.length) % currentLightboxItems.length;
    updateLightbox();
  }
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  document.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ========================================
  // 5. АНИМАЦИИ ПРИ СКРОЛЛЕ
  // ========================================
  function observeElements() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { 
        if (entry.isIntersecting) { 
          entry.target.classList.add('visible'); 
          observer.unobserve(entry.target); 
        } 
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.portfolio-item:not(.visible)').forEach(el => observer.observe(el));
  }

  // ========================================
  // 6. КАРУСЕЛЬ ДИПЛОМОВ
  // ========================================
  const track = document.getElementById('diploma-track');
  if (track && typeof diplomasData !== 'undefined') {
    diplomasData.forEach((d, i) => {
      const el = document.createElement('div');
      el.className = 'diploma-item';
      el.innerHTML = `
        <img src="${d.src}" alt="${d.alt}" loading="lazy" onerror="this.src='https://placehold.co/400x300/e0e0e0/888?text=Нет+изображения'">
        <div class="diploma-caption">${d.alt}</div>
      `;
      el.addEventListener('click', () => openLightbox('diplomas', i));
      track.appendChild(el);
    });

    document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
      track.scrollBy({ left: -240, behavior: 'smooth' });
    });
    document.querySelector('.carousel-btn.next').addEventListener('click', () => {
      track.scrollBy({ left: 240, behavior: 'smooth' });
    });
  }

  // ========================================
  // 7. ВЫСТАВКИ И НОВОСТИ (динамическая загрузка)
  // ========================================
  let newsData = [];
  let displayedNews = [];
  let newsAllLoaded = false;
  const NEWS_PER_PAGE = 3;
  let newsPage = 1;

  const exhibitionsGrid = document.getElementById('exhibitions-grid');
  const loadMoreExhibitionsBtn = document.getElementById('load-more-exhibitions');
  const exhibitionsCollapseBtn = document.querySelector('[data-section="exhibitions"]');
  const exhibitionsContent = document.getElementById('exhibitions-content');

  // Загрузка новостей из news-index.json
  async function loadNews() {
    try {
      const response = await fetch('news-index.json');
      if (!response.ok) throw new Error('news-index.json не найден');
      newsData = await response.json();
      renderNews();
    } catch (error) {
      console.log('Новости не загружены:', error.message);
      // Показываем placeholder если файла нет
      exhibitionsGrid.innerHTML = `
        <div class="news-placeholder" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #888;">
          <p>Раздел "Выставки и новости"</p>
          <p style="font-size: 0.9rem; margin-top: 1rem;">
            Добавьте файлы в папку <code>news/</code> и запустите <code>python3 generate-news-index.py</code>
          </p>
        </div>
      `;
      loadMoreExhibitionsBtn.classList.add('hidden');
    }
  }

  function renderNews(append = false) {
    if (!append) {
      exhibitionsGrid.innerHTML = '';
      displayedNews = [];
    }

    const start = (newsPage - 1) * NEWS_PER_PAGE;
    const end = newsAllLoaded ? newsData.length : start + NEWS_PER_PAGE;
    const toShow = newsData.slice(start, end);

    toShow.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'news-card';
      const globalIdx = displayedNews.length;

      let mediaHtml = '';
      if (item.type === 'image') {
        mediaHtml = `<img src="${item.src}" alt="${item.title}" loading="lazy">`;
      } else if (item.type === 'video') {
        mediaHtml = `
          <video poster="https://placehold.co/600x400/e0e0e0/888?text=Видео" muted>
            <source src="${item.src}" type="video/mp4">
          </video>
          <div class="news-icon">▶ Видео</div>
        `;
      } else if (item.type === 'article') {
        mediaHtml = `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--light-gray);"><span style="font-size:3rem;">📄</span></div>`;
      }

      el.innerHTML = `
        <div class="news-media">
          ${mediaHtml}
          <div class="news-overlay">
            <div class="news-overlay-title">${item.title}</div>
            <div class="news-overlay-desc">${item.description || 'Нажмите для просмотра'}</div>
          </div>
        </div>
        <div class="news-content">
          <span class="news-date">${item.date}</span>
          <div class="news-title">${item.title}</div>
          ${item.type === 'article' ? '<div class="news-excerpt">Читать статью...</div>' : ''}
        </div>
      `;

      el.addEventListener('click', () => {
        if (item.type === 'article') {
          window.open(item.src, '_blank');
        } else {
          openLightbox('news', globalIdx);
        }
      });

      exhibitionsGrid.appendChild(el);
      displayedNews.push(item);
    });

    updateNewsLoadMoreBtn();
  }

  function updateNewsLoadMoreBtn() {
    const hasMore = displayedNews.length < newsData.length;
    loadMoreExhibitionsBtn.classList.toggle('hidden', !hasMore && !newsAllLoaded);
    loadMoreExhibitionsBtn.textContent = newsAllLoaded ? 'Все материалы загружены' : 'Показать ещё';
  }

  loadMoreExhibitionsBtn.addEventListener('click', () => {
    if (!newsAllLoaded) {
      newsAllLoaded = true;
      renderNews(true);
    }
  });

  // Sticky кнопка для выставок
  if (exhibitionsCollapseBtn && exhibitionsContent) {
    exhibitionsCollapseBtn.addEventListener('click', () => {
      const isCollapsed = exhibitionsContent.classList.toggle('collapsed');
      exhibitionsCollapseBtn.textContent = isCollapsed ? 'Развернуть ▼' : 'Свернуть ▲';

      if (isCollapsed) {
        newsPage = 1;
        newsAllLoaded = false;
        displayedNews = [];
        renderNews(false);
      }
    });

    // IntersectionObserver для sticky-кнопки выставок
    const exhibitionsSection = document.getElementById('exhibitions');
    const exhibitionsSentinel = document.createElement('div');
    exhibitionsSentinel.style.height = '1px';
    exhibitionsSentinel.style.position = 'absolute';
    exhibitionsSentinel.style.top = '0';
    exhibitionsSection.style.position = 'relative';
    exhibitionsSection.insertBefore(exhibitionsSentinel, exhibitionsSection.firstChild);

    const exhibitionsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          exhibitionsCollapseBtn.classList.add('is-sticky');
        } else {
          exhibitionsCollapseBtn.classList.remove('is-sticky');
        }
      });
    }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });

    exhibitionsObserver.observe(exhibitionsSentinel);
  }

  // Загружаем новости при старте
  loadNews();

  // ========================================
  // 8. СВОРАЧИВАНИЕ ВЫСТАВОК (статичных)
  // ========================================
  document.querySelectorAll('.collapse-btn[data-target]:not([data-section])').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const isCollapsed = target.classList.toggle('collapsed');
      btn.textContent = isCollapsed ? 'Развернуть ▼' : 'Свернуть ▲';
    });
  });

  // ========================================
  // 9. ФОРМА СВЯЗИ
  // ========================================
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    contactForm.style.display = 'none';
    successMsg.style.display = 'block';
    setTimeout(() => { 
      successMsg.style.display = 'none'; 
      contactForm.style.display = 'flex'; 
      contactForm.reset(); 
    }, 4000);
  });

  // ========================================
  // 10. МОБИЛЬНОЕ МЕНЮ
  // ========================================
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    const toggle = () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };
    mobileToggle.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
    document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', toggle));
  }

  // ========================================
  // ЗАПУСК
  // ========================================
  document.getElementById('year').textContent = new Date().getFullYear();
  renderPortfolio();
});