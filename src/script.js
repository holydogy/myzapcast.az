// Səhifə yükləndikdən sonra işləyəcək kodlar
document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Reveal (Səhifəni sürüşdürdükdə elementlərin yavaşca çıxması)
    const revealElements = document.querySelectorAll('.product-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.classList.add('reveal'); // CSS-dəki reveal klasını əlavə edirik
        revealObserver.observe(el);
    });

    // 2. Mouse Parallax (Siçan hərəkətinə görə kartların meyl etməsi)
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // 3. Axtarış ikonu üçün fokuslama
    const searchBtn = document.querySelector('.nav-search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            alert('Axtarış bölməsi aktivləşdirilir...');
        });
    }

});
