// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 0. İstifadəçi Girişi və Header Yenilənməsi
    const updateHeaderAuth = () => {
        const authContainer = document.querySelector('.auth-buttons');
        if (!authContainer) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {
            authContainer.innerHTML = `
                <div class="user-profile-info" style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 13px; font-weight: 800; color: var(--text-main);">${currentUser.name}</span>
                    <button id="user-logout" class="btn-login" style="border: none; background: #f1f5f9; cursor: pointer; padding: 0.5rem 1rem; border-radius: var(--radius-full); font-weight: 700;">Çıxış</button>
                </div>
            `;

            document.getElementById('user-logout').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                location.reload();
            });
        }
    };

    updateHeaderAuth();

    // 0.1 Elan Yerləşdir Düyməsi Auth Yoxlaması
    const adPostBtn = document.querySelector('.ad-post-btn');
    if (adPostBtn) {
        adPostBtn.addEventListener('click', (e) => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                e.preventDefault();
                window.location.href = '/register.html';
            }
        });
    }

    // 0.2 LocalStorage-dan elanları yükləyib göstərmək
    const renderAds = () => {
        const adsContainer = document.querySelector('.ads-grid');
        if (!adsContainer) return;

        const storedAds = JSON.parse(localStorage.getItem('ads')) || [
            { id: 1, title: 'BMW E60 Mühərrik Yastığı', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
            { id: 2, title: 'Mercedes W211 Ön Bufer', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' }
        ];

        adsContainer.innerHTML = '';

        const activeAds = storedAds.filter(ad => ad.status === 'active');

        if (activeAds.length === 0) {
            adsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">Hələ ki, aktiv elan yoxdur.</p>';
            return;
        }

        activeAds.reverse().forEach(ad => {
            const adHTML = `
                <article class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${ad.image}" alt="${ad.title}" class="product-img">
                    </div>
                    <div class="product-info">
                        <div class="product-price">${ad.price} ₼</div>
                        <h3 class="product-name">${ad.title}</h3>
                        <div class="product-footer">
                            <span class="loc">Bakı, bugün</span>
                            <button class="btn-call-cirle">
                                <i class="fa-solid fa-phone"></i>
                            </button>
                        </div>
                    </div>
                </article>
            `;
            adsContainer.insertAdjacentHTML('beforeend', adHTML);
        });
    };

    renderAds();

    // 1. Hero Reveal Animations
    const heroItems = document.querySelectorAll('.hero-reveal-item');
    setTimeout(() => {
        heroItems.forEach(item => {
            item.classList.add('revealed');
        });
    }, 100);

    // 2. Scroll Parallax
    const blobs = document.querySelectorAll('.parallax-blob');
    const heroContainer = document.querySelector('.hero-reveal-container');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.1;
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });

        if (heroContainer) {
            heroContainer.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContainer.style.opacity = 1 - (scrolled / 700);
        }
    });

    // 3. Mouse Parallax (Card Rotation)
    document.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        }
    });

    // 4. Scroll Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => revealObserver.observe(card));

});
