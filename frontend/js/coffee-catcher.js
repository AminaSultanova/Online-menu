class CoffeeCatcherGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.isPlaying = false;
        this.score = 0;
        this.lives = 3;
        this.bestScore = parseInt(localStorage.getItem('coffeeBestScore')) || 0;
        this.totalBonuses = parseInt(localStorage.getItem('coffeeBonuses')) || 0;
        
        this.cup = {
            x: 0,
            y: 0,
            width: 80,
            height: 60,
            speed: 8
        };
        
        this.items = [];
        this.itemSpawnRate = 90;
        this.itemSpawnCounter = 0;
        
        this.goodItems = [
            { emoji: '☕', name: 'coffee', points: 10 },
            { emoji: '🥛', name: 'milk', points: 8 },
            { emoji: '🍯', name: 'honey', points: 12 },
            { emoji: '🧊', name: 'ice', points: 5 }
        ];
        
        this.badItems = [
            { emoji: '🦠', name: 'bacteria' },
            { emoji: '💀', name: 'poison' }
        ];
        
        this.keys = {};
        this.mouseX = 0;
        this.touchX = 0;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.touchX = e.touches[0].clientX - rect.left;
        });
        
        this.updateStats();
    }
    
    resizeCanvas() {
        const wrapper = document.querySelector('.game-canvas-wrapper');
        this.canvas.width = wrapper.offsetWidth;
        this.canvas.height = 500;
        
        this.cup.y = this.canvas.height - this.cup.height - 20;
        this.cup.x = this.canvas.width / 2 - this.cup.width / 2;
    }
    
    start() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        this.isPlaying = true;
        this.score = 0;
        this.lives = 3;
        this.items = [];
        this.itemSpawnCounter = 0;
        this.itemSpawnRate = 90;
        
        this.cup.x = this.canvas.width / 2 - this.cup.width / 2;
        this.cup.y = this.canvas.height - this.cup.height - 20;
        
        this.updateStats();
        this.gameLoop();
    }
    
    spawnItem() {
        const allItems = [...this.goodItems, ...this.badItems];
        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
        
        const isGood = this.goodItems.includes(randomItem);
        
        const item = {
            x: Math.random() * (this.canvas.width - 40) + 20,
            y: -40,
            width: 40,
            height: 40,
            speed: 10 + Math.random() * 2,
            emoji: randomItem.emoji,
            isGood: isGood,
            points: isGood ? randomItem.points : 0
        };
        
        this.items.push(item);
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.cup.x -= this.cup.speed;
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.cup.x += this.cup.speed;
        }
        
        if (this.mouseX > 0 || this.touchX > 0) {
            const targetX = this.mouseX || this.touchX;
            const diff = targetX - (this.cup.x + this.cup.width / 2);
            this.cup.x += diff * 0.15;
        }
        
        if (this.cup.x < 0) this.cup.x = 0;
        if (this.cup.x + this.cup.width > this.canvas.width) {
            this.cup.x = this.canvas.width - this.cup.width;
        }
        
        this.itemSpawnCounter++;
        if (this.itemSpawnCounter >= this.itemSpawnRate) {
            this.spawnItem();
            this.itemSpawnCounter = 0;
            
            if (this.itemSpawnRate > 30) {
                this.itemSpawnRate -= 0.5;
            }
        }
        
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.y += item.speed;
            
            if (this.checkCollision(item, this.cup)) {
                if (item.isGood) {
                    this.score += item.points;
                    this.showFloatingText(`+${item.points}`, item.x, item.y, '#4CAF50');
                } else {
                    this.lives--;
                    this.updateLivesDisplay();
                    this.showFloatingText('-1 ❤️', item.x, item.y, '#F44336');
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
                this.items.splice(i, 1);
            }
            else if (item.y > this.canvas.height) {
                this.items.splice(i, 1);
            }
        }
        
        this.updateStats();
    }
    
    checkCollision(item, cup) {
        return item.x < cup.x + cup.width &&
               item.x + item.width > cup.x &&
               item.y < cup.y + cup.height &&
               item.y + item.height > cup.y;
    }
    
    showFloatingText(text, x, y, color) {
        const floating = {
            text,
            x,
            y,
            color,
            opacity: 1,
            life: 60
        };
        
        const animate = () => {
            if (floating.life <= 0) return;
            
            this.ctx.save();
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = floating.opacity;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(floating.text, floating.x, floating.y);
            this.ctx.restore();
            
            floating.y -= 1;
            floating.opacity -= 0.02;
            floating.life--;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    draw() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1e3c72');
        gradient.addColorStop(1, '#2a5298');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawStars();
        
        this.items.forEach(item => {
            this.ctx.font = '36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.emoji, item.x + item.width / 2, item.y + item.height / 2 + 12);
        });
        
        this.drawCup();
        
        this.ctx.save();
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);
        this.ctx.restore();
    }
    
    drawCup() {
    const ctx = this.ctx;
    const cup = this.cup;

    const radius = 12;
    ctx.fillStyle = "#F4E7D0";
    ctx.beginPath();
    ctx.moveTo(cup.x + radius, cup.y);
    ctx.lineTo(cup.x + cup.width - radius, cup.y);
    ctx.quadraticCurveTo(cup.x + cup.width, cup.y, cup.x + cup.width, cup.y + radius);
    ctx.lineTo(cup.x + cup.width, cup.y + cup.height - radius);
    ctx.quadraticCurveTo(cup.x + cup.width, cup.y + cup.height, cup.x + cup.width - radius, cup.y + cup.height);
    ctx.lineTo(cup.x + radius, cup.y + cup.height);
    ctx.quadraticCurveTo(cup.x, cup.y + cup.height, cup.x, cup.y + cup.height - radius);
    ctx.lineTo(cup.x, cup.y + radius);
    ctx.quadraticCurveTo(cup.x, cup.y, cup.x + radius, cup.y);
    ctx.fill();

    ctx.fillStyle = "#E8D5B5";
    ctx.fillRect(cup.x, cup.y, cup.width, 8);

    ctx.strokeStyle = "#E8D5B5";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(
        cup.x + cup.width + 8,
        cup.y + cup.height / 2,
        18,
        -Math.PI / 2,
        Math.PI / 2
    );
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.roundRect(cup.x + 6, cup.y + 6, 10, cup.height - 12, 6);
    ctx.fill();
}

    drawStars() {
        this.ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
            const x = (i * 123) % this.canvas.width;
            const y = (i * 456) % this.canvas.height;
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    updateLivesDisplay() {
        const hearts = '❤️'.repeat(this.lives);
        document.getElementById('livesDisplay').textContent = hearts || '💔';
    }
    
    updateStats() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('bestScore').textContent = this.bestScore;
        document.getElementById('totalBonuses').textContent = this.totalBonuses;
    }
    
    gameOver() {
        this.isPlaying = false;
        
        const bonusesEarned = Math.floor(this.score / 5);
        this.totalBonuses += bonusesEarned;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('coffeeBestScore', this.bestScore);
        }
        
        localStorage.setItem('coffeeBonuses', this.totalBonuses);
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('bonusesEarned').textContent = bonusesEarned;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        this.updateStats();
    }
}

let game;

function startGame() {
    if (!game) {
        game = new CoffeeCatcherGame();
    }
    game.start();
}

function restartGame() {
    game.start();
}

function goBackToSelect() {
    window.location.href = 'game-select.html';
}

function updateGameLanguage() {
    const lang = localStorage.getItem("lang") || "ru";
    const elements = document.querySelectorAll('[data-lang-ru]');
    
    elements.forEach(el => {
        const text = lang === "ru" 
            ? el.getAttribute('data-lang-ru')
            : el.getAttribute('data-lang-en');
        
        if (text) {
            el.textContent = text;
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    updateGameLanguage();
    game = new CoffeeCatcherGame();
});