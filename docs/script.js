(function () {
  'use strict';

  /* ── Loading Screen ── */

  var fill = document.getElementById('loading-fill');
  var pct = document.getElementById('loading-percent');
  var ocean = document.getElementById('loading-ocean');
  var screen = document.getElementById('loading-screen');
  var progress = 0;
  var loadDone = false;
  var heroSub = document.querySelector('.subtitle');
  var heroSubText = heroSub ? heroSub.textContent : '';

  function setProgress(v) {
    progress = Math.min(Math.round(v), 100);
    if (fill) fill.style.width = progress + '%';
    if (ocean) ocean.style.height = progress + '%';
    if (pct) pct.textContent = progress + '%';
  }

  setProgress(8);

  var ticker = setInterval(function () {
    if (progress < 90) setProgress(progress + (90 - progress) * 0.06);
  }, 100);

  function completeLoad() {
    if (loadDone) return;
    loadDone = true;
    clearInterval(ticker);
    setProgress(100);
    setTimeout(function () {
      if (screen) {
        screen.classList.add('done');
        setTimeout(function () { screen.remove(); }, 600);
      }
      initScrollAnimations();
      if (heroSub && heroSubText) {
        setTimeout(function () { typeText(heroSub, heroSubText, 30); }, 200);
      }
    }, 500);
  }

  window.addEventListener('load', completeLoad);
  setTimeout(completeLoad, 8000);

  /* ── Typewriter ── */

  function typeText(el, text, speed, onDone) {
    el.textContent = '';
    el.classList.add('typing-cursor');
    var i = 0;
    var id = setInterval(function () {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
      } else {
        clearInterval(id);
        el.classList.remove('typing-cursor');
        if (onDone) onDone();
      }
    }, speed);
    return function () { clearInterval(id); el.classList.remove('typing-cursor'); };
  }

  /* ── Dark Mode ── */

  if (localStorage.getItem('dark') === 'true') {
    document.body.classList.add('dark');
  }

  function toggleDark() {
    document.body.classList.toggle('dark');
    localStorage.setItem('dark', document.body.classList.contains('dark'));
  }

  var darkBtn = document.getElementById('dark-toggle');
  var darkBtnMobile = document.getElementById('dark-toggle-mobile');
  if (darkBtn) darkBtn.addEventListener('click', toggleDark);
  if (darkBtnMobile) darkBtnMobile.addEventListener('click', toggleDark);

  /* ── BGM Audio ── */

  var bgm = document.getElementById('bgm');
  var bgmBtn = document.getElementById('bgm-toggle');
  var bgmBtnMobile = document.getElementById('bgm-toggle-mobile');
  var bgmIcon = document.getElementById('bgm-icon');
  var bgmLabel = document.getElementById('bgm-label');
  var bgmPlaying = false;

  if (bgm) {
    bgm.volume = 0.3;
  }

  function updateBgmUI() {
    var iconChar = bgmPlaying ? '&' : 'x';
    var labelText = bgmPlaying ? '播放' : '静音';
    if (bgmIcon) bgmIcon.textContent = iconChar;
    if (bgmLabel) bgmLabel.textContent = labelText;
    if (bgmBtn) bgmBtn.classList.toggle('bgm-playing', bgmPlaying);
    if (bgmBtnMobile) {
      bgmBtnMobile.textContent = iconChar;
      bgmBtnMobile.classList.toggle('bgm-playing', bgmPlaying);
    }
  }

  function toggleBgm() {
    if (!bgm) return;
    if (bgmPlaying) {
      bgm.pause();
      bgmPlaying = false;
    } else {
      bgm.play().catch(function () {});
      bgmPlaying = true;
    }
    localStorage.setItem('bgm', bgmPlaying ? 'on' : 'off');
    updateBgmUI();
  }

  if (bgmBtn) bgmBtn.addEventListener('click', toggleBgm);
  if (bgmBtnMobile) bgmBtnMobile.addEventListener('click', toggleBgm);

  /* Restore BGM state -- requires user gesture, so only auto-resume on first click */
  if (localStorage.getItem('bgm') === 'on' && bgm) {
    var resumeOnce = function () {
      if (!bgmPlaying) {
        bgm.play().then(function () {
          bgmPlaying = true;
          updateBgmUI();
        }).catch(function () {});
      }
      document.removeEventListener('click', resumeOnce);
      document.removeEventListener('keydown', resumeOnce);
    };
    document.addEventListener('click', resumeOnce);
    document.addEventListener('keydown', resumeOnce);
  }

  updateBgmUI();

  /* ── Scroll-Snap Container & Progress Bar ── */

  var snapContainer = document.getElementById('snap-container');
  var bar = document.getElementById('scroll-progress');

  if (snapContainer) {
    snapContainer.addEventListener('scroll', function () {
      var h = snapContainer.scrollHeight - snapContainer.clientHeight;
      if (bar && h > 0) bar.style.width = (snapContainer.scrollTop / h) * 100 + '%';
    }, { passive: true });
  }

  /* ── Sidebar / Mobile Nav: Active Section Tracking ── */

  var sections = document.querySelectorAll('.snap-section[id]');
  var sidebarItems = document.querySelectorAll('.sidebar-item[data-section]');
  var mobileItems = document.querySelectorAll('.mobile-nav-item[data-section]');

  function setActiveSection(id) {
    sidebarItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-section') === id);
    });
    mobileItems.forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-section') === id);
    });
  }

  if (snapContainer && sections.length > 0) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      root: snapContainer,
      threshold: [0.4]
    });

    sections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });
  }

  /* ── Sidebar & Mobile Nav: Click Navigation ── */

  function handleNavClick(e) {
    e.preventDefault();
    var sectionId = this.getAttribute('data-section') || this.getAttribute('href').slice(1);
    var target = document.getElementById(sectionId);
    if (target && snapContainer) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  sidebarItems.forEach(function (item) { item.addEventListener('click', handleNavClick); });
  mobileItems.forEach(function (item) {
    if (item.tagName === 'A') item.addEventListener('click', handleNavClick);
  });

  /* ── Scroll Animations ── */

  function initScrollAnimations() {
    if (!snapContainer) return;

    var observer = new IntersectionObserver(function (entries, obs) {
      var live = [];
      entries.forEach(function (e) { if (e.isIntersecting) live.push(e); });
      live.forEach(function (entry, i) {
        setTimeout(function () {
          entry.target.classList.add('visible');
          entry.target.addEventListener('animationend', function () {
            this.classList.remove('fade-in');
          }, { once: true });
        }, i * 80);
        obs.unobserve(entry.target);
      });
    }, {
      root: snapContainer,
      threshold: 0.08
    });

    snapContainer.querySelectorAll('.card, .step, .tip').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight + 40) {
        return;
      }
      el.classList.add('fade-in');
      observer.observe(el);
    });
  }

  /* ── Lightbox ── */

  var CAPTIONS = {
    '项目架构图': '这是工作台的全景。你把文件丢进 inbox，跟 Claude 说一声想要什么，它会和你聊两句确认清楚，然后写张便签把方案定下来。有了便签，后面全自动——选 Skill、处理文件、产出结果、更新索引、提交 Git，一条龙。',
    '处理流程图': '一个任务走完全程就 5 步。先把文件夹扔进 inbox，然后告诉 Claude 你想要什么——它会跟你确认细节，写张便签把方案定下来。有了便签，后面全自动：按方案选 Skill 处理，产出结果，更新索引提交 Git。你参与前两步定方向，后面三步 Claude 包办。',
    'Skill 路由表': '这是 Skill 和文件类型的对应关系。Excel 一般走 minimax-xlsx，Word 走 minimax-docx，PPT 走 pptx-generator。PDF 有三条路——转文字用 mineru，合并拆分用 pdf，要做精美排版就用 minimax-pdf。具体怎么选，是你和 Claude 在写便签时一起定的，不是系统自己猜的。',
    'Loop 自动化流程': '两个后台定时任务替你值班。inbox-monitor 每 20 分钟扫一遍收件箱，看到写好便签的任务就拉走处理，没便签的不碰，等你跟 Claude 定好方案再说。daily-routine 每天跑一次，读当天的工作记录写日报，周五还额外出一份周报。你该干嘛干嘛，它们自己会转。'
  };

  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCaption = document.getElementById('lightbox-caption');
  var cancelCaption = null;

  document.querySelectorAll('.img-full, .img-center').forEach(function (img) {
    img.addEventListener('click', function () {
      if (!lightbox) return;
      lbImg.src = this.currentSrc || this.src;
      lbImg.alt = this.alt;
      lbCaption.textContent = '';
      lbCaption.classList.remove('typing-cursor');
      lightbox.classList.add('active');
      var desc = CAPTIONS[this.alt];
      if (desc) {
        setTimeout(function () {
          cancelCaption = typeText(lbCaption, desc, 25);
        }, 300);
      }
    });
  });

  function closeLightbox() {
    if (cancelCaption) { cancelCaption(); cancelCaption = null; }
    if (lightbox) lightbox.classList.remove('active');
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('active')) closeLightbox();
      document.querySelectorAll('.ref-panel.open').forEach(function (p) { p.classList.remove('open'); });
    }
  });

  /* ── Reference Panels ── */

  document.querySelectorAll('.ref-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(this.getAttribute('data-ref'));
      if (panel) panel.classList.add('open');
    });
  });

  document.querySelectorAll('.ref-panel').forEach(function (panel) {
    panel.addEventListener('click', function (e) {
      if (e.target === panel) panel.classList.remove('open');
    });
  });

  document.querySelectorAll('.ref-panel-close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      this.closest('.ref-panel').classList.remove('open');
    });
  });

  /* ── Particles (Ocean Bubbles) ── */

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var N = 35;
  var bubbles = [];
  for (var i = 0; i < N; i++) {
    bubbles.push({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      r: 1.5 + Math.random() * 2.5,
      speed: 0.1 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      a: 0.04 + Math.random() * 0.08
    });
  }

  requestAnimationFrame(function loop(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var dark = document.body.classList.contains('dark');
    for (var i = 0; i < N; i++) {
      var b = bubbles[i];
      b.x += Math.sin(b.phase + t * 0.0005) * 0.25;
      b.y -= b.speed;
      if (b.y < -10) { b.y = canvas.height + 10; b.x = Math.random() * canvas.width; }
      if (b.x < -10) b.x = canvas.width + 10;
      if (b.x > canvas.width + 10) b.x = -10;
      var o = b.a + Math.sin(t * 0.0008 + b.phase) * 0.02;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 6.283);
      ctx.fillStyle = dark
        ? 'rgba(91,181,197,' + o + ')'
        : 'rgba(42,107,124,' + o + ')';
      ctx.fill();
    }
    requestAnimationFrame(loop);
  });
})();
