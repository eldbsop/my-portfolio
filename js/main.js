const hamburgerBtn = document.querySelector('#hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeToggleBtn = document.querySelector('#theme-toggle');
const projectsContainer = document.querySelector('#projects-container');

const GITHUB_USERNAME = 'eldbsop';

hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggleBtn.textContent = '☀️';
    }
}

themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggleBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';

    localStorage.setItem('theme', newTheme);
});

async function fetchGitHubProjects() {
    projectsContainer.innerHTML = '<p class="loading">프로젝트를 불러오는 중입니다...</p>';

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);

        if (!response.ok) {
            throw new Error(`데이터를 불러오는 데 실패했습니다.`);
        }

        const repos = await response.json();

        if (repos.length === 0) {
            projectsContainer.innerHTML = '<p class="empty">표시할 프로젝트가 없습니다.</p>';
            return;
        }

        const cardsHTML = repos.map(repo => `
            <article class="project-card">
                <h3>${repo.name}</h3>
                <p>${repo.description || '설명이 없습니다.'}</p>
                <div class="card-footer">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">자세히 보기 →</a>
                </div>
            </article>
        `).join('');

        projectsContainer.innerHTML = cardsHTML;

    } catch (error) {
        projectsContainer.innerHTML = `
            <div class="error-box">
                <p>프로젝트를 불러올 수 없습니다.</p>
                <button id="retry-btn">다시 시도</button>
            </div>
        `;

        document.querySelector('#retry-btn')?.addEventListener('click', fetchbProjects);
    }
}

fetchGitHubProjects();

const contactForm = document.querySelector('#contact-form');
contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const messageInput = document.querySelector('#message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    alert('성공적으로 메시지가 전송되었습니다!');
    contactForm.reset();
});

const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

const fadeElements = document.querySelectorAll('.section')
fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

const projectsStatus = document.getElementById('projects-status');
const projectsGrid = document.getElementById('projects-container');

function renderProjectsState(state, data = []) {
  projectsStatus.innerHTML = '';
  projectsGrid.innerHTML = '';
  projectsStatus.style.display = 'block';
  projectsGrid.style.display = 'none';

  if (state === 'loading') {
    projectsStatus.innerHTML = `
      <div class="spinner"></div>
      <p>로딩 중...</p>
    `;
  } else if (state === 'error') {
    projectsStatus.innerHTML = `
      <p>프로젝트를 불러올 수 없습니다</p>
      <button class="retry-btn" onclick="fetchProjects()">재시도</button>
    `;
  } else if (state === 'empty') {
    projectsStatus.innerHTML = `<p>표시할 프로젝트가 없습니다</p>`;
  } else if (state === 'success') {
    projectsStatus.style.display = 'none';
    projectsGrid.style.display = 'grid';

    data.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      `;
      projectsGrid.appendChild(card);
    });
  }
}

function fetchProjects() {
  renderProjectsState('loading');

  setTimeout(() => {
    const mockData = [
      { id: 1, title: '포트폴리오 웹사이트', description: 'HTML, CSS, JS로 제작한 개인 웹사이트' },
      { id: 2, title: 'MSI MBTI 사이트', description: 'MSI 서포터즈 부스 이벤트 기획' }
    ];
    renderProjectsState('success', mockData);
  }, 1000);
}

document.addEventListener('DOMContentLoaded', fetchProjects);