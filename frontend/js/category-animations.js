class CategoryAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.waitForCategories();
        this.setupScrollAnimations();
        this.setupRippleEffect();
    }

    waitForCategories() {
        const checkInterval = setInterval(() => {
            const categoryList = document.getElementById('categoryList');
            if (categoryList && categoryList.children.length > 0) {
                clearInterval(checkInterval);
                this.animateCategories();
            }
        }, 100);

        setTimeout(() => clearInterval(checkInterval), 5000);
    }

    animateCategories() {
        const cards = document.querySelectorAll('.category-list .card');

        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        const observeCards = () => {
            const cards = document.querySelectorAll('.card:not(.animate-in)');
            cards.forEach(card => observer.observe(card));
        };

        observeCards();

        const contentObserver = new MutationObserver(observeCards);
        const container = document.querySelector('.container');
        if (container) {
            contentObserver.observe(container, {
                childList: true,
                subtree: true
            });
        }
    }

    setupRippleEffect() {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) {

                card.classList.add('ripple');

                setTimeout(() => {
                    card.classList.remove('ripple');
                }, 600);
            }
        });
    }
}

if (location.pathname.includes("categories.html")) {
    window.addEventListener('DOMContentLoaded', () => {
        new CategoryAnimations();
    });
}