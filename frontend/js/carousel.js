class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.carousel-dot');
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;

        this.showSlide(0);

        this.startAutoPlay();

        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e));
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
            carousel.addEventListener('touchstart', () => this.stopAutoPlay());
            carousel.addEventListener('touchend', () => this.startAutoPlay());
        }

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showSlide(index);
                this.stopAutoPlay();
                this.startAutoPlay();
            });
        });
    }

    showSlide(index) {

        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });

        this.currentSlide = index;
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.add('active');
        }
    }

    nextSlide() {
        let next = this.currentSlide + 1;
        if (next >= this.slides.length) {
            next = 0;
        }
        this.showSlide(next);
    }

    prevSlide() {
        let prev = this.currentSlide - 1;
        if (prev < 0) {
            prev = this.slides.length - 1;
        }
        this.showSlide(prev);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }
}

if (location.pathname.includes("categories.html")) {
    window.addEventListener('DOMContentLoaded', () => {
        new Carousel();
    });
}