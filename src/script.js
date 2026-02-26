// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 0. Reveal Observer Definition
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Animasiya olandan sonra izləməni dayandırırıq
            }
        });
    }, { threshold: 0.1 });

    // 1. İstifadəçi Girişi və Header Yenilənməsi
    const updateHeaderAuth = () => {
        try {
            const authContainer = document.querySelector('.auth-buttons');
            if (!authContainer) return;

            const currentUserData = localStorage.getItem('currentUser');
            if (!currentUserData) return;

            const currentUser = JSON.parse(currentUserData);

            if (currentUser && currentUser.name) {
                authContainer.innerHTML = `
                    <div class="user-profile-info" style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 13px; font-weight: 800; color: var(--text-main);">${currentUser.name}</span>
                        <button id="user-logout" class="btn-login" style="border: none; background: #f1f5f9; cursor: pointer; padding: 0.5rem 1rem; border-radius: var(--radius-full); font-weight: 700;">Çıxış</button>
                    </div>
                `;

                document.getElementById('user-logout').addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                });
            }
        } catch (e) {
            console.error("Auth error:", e);
        }
    };

    updateHeaderAuth();

    // 2. Elan Yerləşdir Düyməsi Auth Yoxlaması
    const adPostBtn = document.querySelector('.ad-post-btn');
    if (adPostBtn) {
        adPostBtn.addEventListener('click', (e) => {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                e.preventDefault();
                window.location.href = 'register.html';
            }
        });
    }

    // 3. LocalStorage-dan elanları yükləyib göstərmək
    const renderAds = () => {
        try {
            const adsContainer = document.querySelector('.ads-grid');
            if (!adsContainer) return;

            let storedAds = [];
            try {
                const data = localStorage.getItem('ads');
                storedAds = data ? JSON.parse(data) : [];
            } catch (e) {
                console.error("Ads parse error:", e);
                storedAds = [];
            }

            // Default ads if empty
            if (!storedAds || storedAds.length === 0) {
                storedAds = [
                    { id: 1, title: 'BMW E60 Mühərrik Yastığı', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
                    { id: 2, title: 'Mercedes W211 Ön Bufer', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
                    { id: 3, title: 'Mercedes W222 Multi-Beam LED Faralar', price: 7980, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
                    { id: 4, title: 'Toyota Land Cruiser Su Nasosu (OEM)', price: 3550, image: 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' }
                ];
                localStorage.setItem('ads', JSON.stringify(storedAds));
            }

            adsContainer.innerHTML = '';

            // Filter only active ads
            const activeAds = Array.isArray(storedAds) ? storedAds.filter(ad => ad && ad.status === 'active') : [];

            if (activeAds.length === 0) {
                adsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">Hələ ki, aktiv elan yoxdur.</p>';
                return;
            }

            // Reverse to show newest first and render
            [...activeAds].reverse().forEach(ad => {
                const adHTML = `
                    <article class="product-card">
                        <div class="product-img-wrapper">
                            <img src="${ad.image || ''}" alt="${ad.title || 'Elan'}" class="product-img" onerror="this.src='https://placehold.co/400x300?text=Şəkil+Yoxdur'">
                        </div>
                        <div class="product-info">
                            <div class="product-price">${ad.price || 0} ₼</div>
                            <h3 class="product-name">${ad.title || 'Adsız Elan'}</h3>
                            <div class="product-footer">
                                <span class="loc">Bakı, bugün</span>
                                <button class="btn-call-cirle">
                                    <i class="fa-solid fa-phone"></i>
                                </button>
                            </div>
                        </div>
                    </article>
                `;
                const temp = document.createElement('div');
                temp.innerHTML = adHTML.trim();
                const card = temp.firstChild;
                adsContainer.appendChild(card);

                // Observe for animation
                revealObserver.observe(card);
            });
        } catch (e) {
            console.error("Render error:", e);
        }
    };

    renderAds();

    // 4. Hero Reveal Animations
    const heroItems = document.querySelectorAll('.hero-reveal-item');
    setTimeout(() => {
        heroItems.forEach(item => {
            item.classList.add('revealed');
        });
    }, 100);

    // 5. Scroll Parallax
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

    // 6. Mouse Parallax (Card Rotation) - Using Event Delegation
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
});
