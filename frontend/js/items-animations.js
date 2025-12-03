class ItemAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.waitForItems();
        this.setupScrollAnimations();
    }

    waitForItems() {
        const checkInterval = setInterval(() => {
            const itemList = document.getElementById('itemList');
            if (itemList && itemList.children.length > 0) {
                clearInterval(checkInterval);
                this.animateItems();
            }
        }, 100);

        setTimeout(() => clearInterval(checkInterval), 5000);
    }

    animateItems() {
        const cards = document.querySelectorAll('.item-list .card');
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
            const cards = document.querySelectorAll('.item-list .card:not(.animate-in)');
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
}

if (location.pathname.includes("items.html")) {
    window.addEventListener('DOMContentLoaded', () => {
        new ItemAnimations();
    });
}