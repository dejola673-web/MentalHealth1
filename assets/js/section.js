document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.service-card');
    const indicators = document.querySelectorAll('.indicator');
    const counter = document.querySelector('.slide-counter');
    const slideContainer = document.querySelector('.slideshow-container');
    let autoplayInterval;

    function showSlide(n) {
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;
       
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
       
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        counter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }

    function changeSlide(n) {
        currentSlide += n;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function goToSlide(n) {
        currentSlide = n;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentSlide++;
            showSlide(currentSlide);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Attach event listeners to buttons instead of using inline onclick
    document.querySelectorAll('.slide-btn')[0].addEventListener('click', () => changeSlide(-1));
    document.querySelectorAll('.slide-btn')[1].addEventListener('click', () => changeSlide(1));
    
    // Attach event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Start autoplay on load
    startAutoplay();

    // Pause autoplay on hover
    if (slideContainer) {
        slideContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        slideContainer.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    }
});