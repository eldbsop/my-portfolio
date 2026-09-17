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