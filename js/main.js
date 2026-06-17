(function () {
  'use strict';

  const ROLES = [
    'Engineering Leader.',
    'AI Builder.',
    'Product Creator.'
  ];

  // --- Role rotation ---
  function initRoleRotation() {
    const el = document.getElementById('roleText');
    if (!el) return;

    let index = 0;
    setInterval(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(() => {
        index = (index + 1) % ROLES.length;
        el.textContent = ROLES[index];
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 300);
    }, 3500);

    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }

  // --- Scroll reveal ---
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = entry.target.closest('.projects__grid, .beyond__grid, .timeline')
              ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
              : 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // --- Nav scroll + mobile toggle ---
  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 20);
    }, { passive: true });

    toggle?.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    links?.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Counter animation ---
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1500;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  // --- Marquee duplication ---
  function initMarquee() {
    document.querySelectorAll('.marquee__track').forEach((track) => {
      const content = track.innerHTML;
      track.innerHTML = content + content;
    });
  }

  // --- GitHub API ---
  async function initGitHub() {
    const username = 'trjones1';
    const reposList = document.getElementById('githubReposList');

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
      ]);

      if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

      const user = await userRes.json();
      const repos = await reposRes.json();

      const avatar = document.getElementById('githubAvatar');
      const name = document.getElementById('githubName');
      const bio = document.getElementById('githubBio');
      const reposCount = document.getElementById('githubRepos');
      const followers = document.getElementById('githubFollowers');

      if (avatar) {
        avatar.src = user.avatar_url;
        avatar.alt = `${user.name || username} on GitHub`;
      }
      if (name) name.textContent = user.name || `@${username}`;
      if (bio) bio.textContent = user.bio || 'Building AI-powered experiences.';
      if (reposCount) reposCount.textContent = user.public_repos;
      if (followers) followers.textContent = user.followers;

      if (reposList) {
        const filtered = repos
          .filter((r) => !r.fork)
          .slice(0, 5);

        if (filtered.length === 0) {
          reposList.innerHTML = '<p class="github__loading">No public repositories yet.</p>';
          return;
        }

        reposList.innerHTML = filtered.map((repo) => `
          <a href="${repo.html_url}" class="github__repo" target="_blank" rel="noopener">
            <div class="github__repo-info">
              <h4>${escapeHtml(repo.name)}</h4>
              <p>${escapeHtml(repo.description || 'No description')}</p>
            </div>
            <div class="github__repo-meta">
              ${repo.language ? `<span class="github__repo-lang">${escapeHtml(repo.language)}</span>` : ''}
              ${repo.stargazers_count > 0 ? `<span class="github__repo-stars">★ ${repo.stargazers_count}</span>` : ''}
            </div>
          </a>
        `).join('');
      }
    } catch {
      if (reposList) {
        reposList.innerHTML = `
          <p class="github__error">
            Couldn't load GitHub data. 
            <a href="https://github.com/${username}" target="_blank" rel="noopener" style="color: var(--cyan)">Visit profile →</a>
          </p>`;
      }
      const bio = document.getElementById('githubBio');
      if (bio) bio.textContent = 'Engineering leader & AI builder.';
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Project card tilt ---
  function initProjectTilt() {
    document.querySelectorAll('.showcase-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- Active nav link ---
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.style.color = link.getAttribute('href') === `#${entry.target.id}`
                ? 'var(--text)'
                : '';
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // --- Init ---
  document.getElementById('year').textContent = new Date().getFullYear();

  initRoleRotation();
  initReveal();
  initNav();
  initCounters();
  initMarquee();
  initGitHub();
  initProjectTilt();
  initActiveNav();
})();
