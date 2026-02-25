// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 0. LocalStorage-dan elanları yükləyib göstərmək (Admin panel ilə sinxronizasiya)
    const renderAds = () => {
        const adsContainer = document.querySelector('.ads-grid');
        if (!adsContainer) return;

        // Bazarımızda olan elanları alırıq
        const storedAds = JSON.parse(localStorage.getItem('ads')) || [
            { id: 1, title: 'BMW E60 Mühərrik Yastığı', price: 150, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
            { id: 2, title: 'Mercedes W211 Ön Bufer', price: 350, image: 'https://images.unsplash.com/photo-1600320254378-01e4a2dc98cc?q=80&w=400&h=300&auto=format&fit=crop', status: 'active' },
            { id: 3, title: 'Hyundai Accent Arxa Stop', price: 80, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=400&h=300&auto=format&fit=crop', status: 'pending' }
        ];

        // Konteyneri təmizləyirik ki, dublikat olmasın
        adsContainer.innerHTML = '';

        // Csəhifədə yalnız "active" olanları göstəririk
        const activeAds = storedAds.filter(ad => ad.status === 'active');

        if (activeAds.length === 0) {
            adsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">Hələ ki, aktiv elan yoxdur.</p>';
            return;
        }

        // Elanları əks ardıcıllıqla (yeni olanlar yuxarıda) göstəririk
        activeAds.reverse().forEach(ad => {
            const adHTML = `
                <article class="product-card">
                    <div class="product-img-wrapper">
                        <img src="${ad.image || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=400&h=300&auto=format&fit=crop'}" 
                             alt="${ad.title}" class="product-img">
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

    // 3. Mouse Parallax (Card Rotation) - Event Delegation
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
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Dinamik gələn elementləri izləmək üçün vaxtaşırı yoxlaya bilərik və ya render sonrası qoşa bilərik
    const observeCards = () => {
        document.querySelectorAll('.product-card').forEach(card => revealObserver.observe(card));
    };
    observeCards();

    // 5. Zəng Et düyməsi - Event Delegation
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-call-cirle')) {
            e.preventDefault();
            alert('Satıcı ilə əlaqə yaradılır: +994 50 123 45 67');
        }
    });

    // 6. Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

});
