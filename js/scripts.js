document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    updateToolLogosVisibility(currentTheme);

    themeToggleButton.addEventListener('click', () => {
        let theme = document.body.getAttribute('data-theme');
        if (theme === 'light') {
            theme = 'dark';
            themeToggleButton.classList.remove('bx-sun');
            themeToggleButton.classList.add('bx-moon');
        } else {
            theme = 'light';
            themeToggleButton.classList.remove('bx-moon');
            themeToggleButton.classList.add('bx-sun');
        }
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
        updateToolLogosVisibility(theme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeToggleButton.classList.remove('bx-sun');
            themeToggleButton.classList.add('bx-moon');
        } else {
            themeToggleButton.classList.remove('bx-moon');
            themeToggleButton.classList.add('bx-sun');
        }
    }

    function updateToolLogosVisibility(theme) {
        const lightLogos = document.querySelectorAll('.tool-logo.logo-light');
        const darkLogos = document.querySelectorAll('.tool-logo.logo-dark');

        if (theme === 'light') {
            lightLogos.forEach(logo => logo.style.display = 'inline-block');
            darkLogos.forEach(logo => logo.style.display = 'none');
        } else {
            lightLogos.forEach(logo => logo.style.display = 'none');
            darkLogos.forEach(logo => logo.style.display = 'inline-block');
        }
    }

    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    navbar.style.top = "0";

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            navbar.style.top = `-${navbar.offsetHeight}px`;
        } else {
            navbar.style.top = "0";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    let slideIndex = 1;
    showSlides(slideIndex);

    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    }

    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        let i;
        let slides = document.getElementsByClassName("slide");
        let dots = document.getElementsByClassName("dot");
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        if (slides.length > 0 && dots.length > 0) {
            slides[slideIndex - 1].style.display = "block";
            dots[slideIndex - 1].className += " active";
        }
    }

    const revealEmailButton = document.getElementById('reveal-email-button');
    const emailText = document.getElementById('email-text');
    if (revealEmailButton && emailText) {
        revealEmailButton.addEventListener('click', () => {
            if (emailText.style.display === 'none' || emailText.style.display === '') {
                emailText.style.display = 'inline-block';
                const user = "sajid.shaik1186";
                const domain = "gmail.com";
                emailText.textContent = `${user}@${domain}`;
                revealEmailButton.innerHTML = "<i class='bx bx-check-circle'></i> Email:";
            } else {
                emailText.style.display = 'none';
                revealEmailButton.innerHTML = "<i class='bx bx-envelope'></i> Email";
            }
        });
    }

    const welcomeSection = document.getElementById('welcome');
    const polygonBg = welcomeSection.querySelector('.polygon-bg');
    const numTriangles = 15;

    if (polygonBg) {
        for (let i = 0; i < numTriangles; i++) {
            const triangle = document.createElement('div');
            triangle.classList.add('triangle');
            triangle.style.left = `${Math.random() * 100}%`;
            triangle.style.top = `${Math.random() * 100}%`;
            triangle.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`;
            triangle.style.borderBottomColor = Math.random() > 0.5 ? 'var(--primary-color-light-400)' : 'var(--primary-color-light-600)'; // Vary colors
            polygonBg.appendChild(triangle);
        }

        const triangles = polygonBg.querySelectorAll('.triangle');
        welcomeSection.addEventListener('mousemove', (e) => {
            const rect = welcomeSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            triangles.forEach(triangle => {
                const dx = (x - parseFloat(triangle.style.left) * rect.width / 100);
                const dy = (y - parseFloat(triangle.style.top) * rect.height / 100);
                const dist = Math.sqrt(dx * dx + dy * dy);
                const moveFactor = 300 / (dist + 1);

                const angle = Math.atan2(dy, dx);
                const moveX = Math.cos(angle) * moveFactor;
                const moveY = Math.sin(angle) * moveFactor;

                const originalRotation = parseFloat(triangle.style.transform.match(/rotate\(([^deg)]+)deg\)/)[1]);
                const newAngleDeg = (angle * 180 / Math.PI) + 90;

                const initialLeft = parseFloat(triangle.dataset.initialLeft || triangle.style.left);
                const initialTop = parseFloat(triangle.dataset.initialTop || triangle.style.top);
                if (!triangle.dataset.initialLeft) triangle.dataset.initialLeft = triangle.style.left;
                if (!triangle.dataset.initialTop) triangle.dataset.initialTop = triangle.style.top;

                const maxMove = 20;
                const finalMoveX = Math.max(-maxMove, Math.min(maxMove, moveX * 0.1));
                const finalMoveY = Math.max(-maxMove, Math.min(maxMove, moveY * 0.1));

                triangle.style.transform = `translate(${finalMoveX}px, ${finalMoveY}px) rotate(${originalRotation}deg) scale(${parseFloat(triangle.style.transform.match(/scale\(([^)]+)\)/)[1])})`;
            });
        });
        welcomeSection.addEventListener('mouseleave', () => {
            triangles.forEach(triangle => {
                const originalRotation = parseFloat(triangle.style.transform.match(/rotate\(([^deg)]+)deg\)/)[1]);
                const originalScale = parseFloat(triangle.style.transform.match(/scale\(([^)]+)\)/)[1]);
                triangle.style.transform = `translate(0px, 0px) rotate(${originalRotation}deg) scale(${originalScale})`;
            });
        });
    }

    // --- Moving Circles in "My Tools" Section ---
    const toolsSection = document.getElementById('my-tools');
    const circlesContainer = toolsSection.querySelector('.tools-circles-container');
    const numCircles = 4;

    if (circlesContainer) {
        if (!circlesContainer.querySelector('.tool-circle')) {
            const circleClasses = ['c1', 'c2', 'c3', 'c4'];
            circleClasses.forEach(cClass => {
                const circle = document.createElement('div');
                circle.classList.add('tool-circle', cClass);
                circlesContainer.appendChild(circle);
            });
        }
    }
});