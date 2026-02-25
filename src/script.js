// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Parallax (Bloblar və Hero üçün)
    const blobs = document.querySelectorAll('.parallax-blob');
    const heroContent = document.querySelector('.hero .container');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Blobların hərəkəti (Hər biri fərqli sürətlə)
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.15;
            blob.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Hero bölməsinin yavaşca yuxarı sürüşməsi və solğunlaşması
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.opacity = 1 - (scrolled / 600);
        }
    });

    // 2. Mouse Parallax (Kartlar üçün 3D Effekt)
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Kartın meyl etmə dərəcəsi
            const rotateX = (y - centerY) / 12;
            const rotateY = (centerX - x) / 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        });
    });

    // 3. Scroll Reveal (Elanların səliqəli çıxışı)
    const revealElements = document.querySelectorAll('.product-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Zəng Et düyməsi
    const callBtns = document.querySelectorAll('.btn-call-cirle');
    callBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Satıcı ilə əlaqə yaradılır: +994 50 123 45 67');
        });
    });

});
