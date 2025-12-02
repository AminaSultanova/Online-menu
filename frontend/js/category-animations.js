// Category animations: fade in on scroll, ripple on click, smooth scroll to items

class CategoryAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for categories to load, then animate them
        this.waitForCategories();
        
        // Setup intersection observer for scroll animations
        this.setupScrollAnimations();
        
        // Setup click ripple effect
        this.setupRippleEffect();
    }

    waitForCategories() {
        // Check if categories are loaded
        const checkInterval = setInterval(() => {
            const categoryList = document.getElementById('categoryList');
            if (categoryList && categoryList.children.length > 0) {
                clearInterval(checkInterval);
                this.animateCategories();
            }
        }, 100);

        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(checkInterval), 5000);
    }

    animateCategories() {
        const cards = document.querySelectorAll('.category-list .card');
        
        // Add animation class to each card with delay
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100); // 100ms delay between each card
        });
    }

    setupScrollAnimations() {
        // Use Intersection Observer for scroll-triggered animations
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

        // Observe all cards (will work for dynamically added items too)
        const observeCards = () => {
            const cards = document.querySelectorAll('.card:not(.animate-in)');
            cards.forEach(card => observer.observe(card));
        };

        // Initial observation
        observeCards();

        // Re-observe when new content is added
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
                // Add ripple class
                card.classList.add('ripple');
                
                // Remove ripple class after animation
                setTimeout(() => {
                    card.classList.remove('ripple');
                }, 600);
            }
        });
    }
}

// Initialize category animations when DOM is loaded
if (location.pathname.includes("categories.html")) {
    window.addEventListener('DOMContentLoaded', () => {
        new CategoryAnimations();
    });
}