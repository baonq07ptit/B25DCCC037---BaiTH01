document.addEventListener('DOMContentLoaded', () => {

    // 1. DARK/LIGHT MODE TOGGLE
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeIcon.className = 'fas fa-sun';
        } else {
            document.documentElement.classList.remove('dark');
            themeIcon.className = 'fas fa-moon';
        }
    };

    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // 2. HAMBURGER MENU CHO MOBILE
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.className = 'fas fa-bars';
        } else {
            menuIcon.className = 'fas fa-times';
        }
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.className = 'fas fa-bars';
        });
    });

    // 3. HIỂN THỊ NĂM HIỆN TẠI TẠI FOOTER
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // 4. SCROLL REVEAL ANIMATION & HIGHLIGHT ACTIVE MENU
    const revealElements = document.querySelectorAll('.reveal');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScroll = () => {
        const windowHeight = window.innerHeight;

        // Check reveal animation
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });

        // Highlight active nav link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 5. LỌC VÀ TÌM KIẾM DỰ ÁN
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('project-search');
    const noProjectsMsg = document.getElementById('no-projects');

    let currentCategory = 'all';
    let currentSearchQuery = '';

    // Bỏ dấu tiếng Việt để tìm kiếm "thiết kế" khớp với "thiet ke"
    const normalize = (str) => str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd');

    const filterProjects = () => {
        let visibleCount = 0;

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = normalize(card.getAttribute('data-title'));

            const matchesCategory = (currentCategory === 'all' || category === currentCategory);
            const matchesSearch = title.includes(normalize(currentSearchQuery));

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (visibleCount === 0) {
            noProjectsMsg.classList.remove('hidden');
        } else {
            noProjectsMsg.classList.add('hidden');
        }
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-filter'));
            btn.classList.add('active-filter');
            currentCategory = btn.getAttribute('data-filter');
            filterProjects();
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.trim();
        filterProjects();
    });

    // 6. BỘ ĐẾM KÝ TỰ (CHARACTER COUNTER)
    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('char-counter');

    messageInput.addEventListener('input', (e) => {
        const length = e.target.value.length;
        charCounter.textContent = `${length} / 200 ký tự`;
        if (length >= 190) {
            charCounter.classList.add('text-red');
        } else {
            charCounter.classList.remove('text-red');
        }
    });

    // 7. VALIDATE FORM LIÊN HỆ
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    const showError = (input, message) => {
        const errorSpan = input.nextElementSibling;
        errorSpan.textContent = message;
        errorSpan.classList.remove('hidden');
        input.classList.add('input-error');
    };

    const clearError = (input) => {
        const errorSpan = input.nextElementSibling;
        errorSpan.textContent = '';
        errorSpan.classList.add('hidden');
        input.classList.remove('input-error');
    };

    const validateName = () => {
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Vui lòng nhập họ và tên');
            return false;
        }
        clearError(nameInput);
        return true;
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Vui lòng nhập địa chỉ email');
            return false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'Định dạng email không hợp lệ');
            return false;
        }
        clearError(emailInput);
        return true;
    };

    const validateMessage = () => {
        if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Nội dung tin nhắn phải có ít nhất 10 ký tự');
            return false;
        }
        clearError(messageInput);
        return true;
    };

    // Chỉ báo lỗi khi rời ô nhập; sau khi đã có lỗi thì kiểm tra lại theo từng ký tự
    const liveValidate = (input, validateFn) => {
        input.addEventListener('blur', validateFn);
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) validateFn();
        });
    };

    liveValidate(nameInput, validateName);
    liveValidate(emailInput, validateEmail);
    liveValidate(messageInput, validateMessage);

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isMessageValid) {
            alert('Cảm ơn bạn! Tin nhắn đã được gửi thành công.');
            contactForm.reset();
            charCounter.textContent = '0 / 200 ký tự';
            charCounter.classList.remove('text-red');
        }
    });
});