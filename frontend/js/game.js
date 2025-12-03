// Coffee Tower Game Logic

class CoffeeTowerGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.isPlaying = false;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.totalBonuses = parseInt(localStorage.getItem('totalBonuses')) || 0;
        this.blocks = [];
        this.currentBlock = null;
        this.blockWidth = 80;
        this.blockHeight = 30;
        this.blockSpeed = 2;
        this.direction = 1;

        this.colors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887'];
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.canvas.addEventListener('click', () => this.placeBlock());

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.placeBlock();
        });
        
        this.updateStats();
    }
    
    resizeCanvas() {
        const wrapper = document.querySelector('.game-canvas-wrapper');
        this.canvas.width = wrapper.offsetWidth;
        this.canvas.height = 500;
    }
    
    start() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        this.isPlaying = true;
        this.score = 0;
        this.blocks = [];
        this.blockSpeed = 2;
        this.blocks.push({
            x: this.canvas.width / 2 - this.blockWidth / 2,
            y: this.canvas.height - this.blockHeight,
            width: this.blockWidth,
            color: this.colors[0]
        });
        
        this.createNewBlock();
        this.updateStats();
        this.gameLoop();
    }
    
    createNewBlock() {
        const prevBlock = this.blocks[this.blocks.length - 1];
        this.currentBlock = {
            x: 0,
            y: prevBlock.y - this.blockHeight - 5,
            width: prevBlock.width,
            color: this.colors[this.blocks.length % this.colors.length],
            moving: true
        };
        this.direction = Math.random() > 0.5 ? 1 : -1;
    }
    
    placeBlock() {
        if (!this.isPlaying || !this.currentBlock || !this.currentBlock.moving) return;
        
        this.currentBlock.moving = false;
        const prevBlock = this.blocks[this.blocks.length - 1];
        const overlap = this.calculateOverlap(this.currentBlock, prevBlock);
        
        if (overlap <= 0) {
            this.gameOver();
            return;
        }

        this.currentBlock.width = overlap;

        const prevLeft = prevBlock.x;
        const prevRight = prevBlock.x + prevBlock.width;
        const currLeft = this.currentBlock.x;
        const currRight = this.currentBlock.x + this.currentBlock.width;
        
        if (currLeft < prevLeft) {
            this.currentBlock.x = prevLeft;
        }
        
        this.blocks.push({...this.currentBlock});
        const accuracy = (overlap / prevBlock.width) * 100;
        let points = 1;
        
        if (accuracy > 95) {
            points = 5;
            this.showMessage('Perfect! 🎉', this.currentBlock.x + this.currentBlock.width / 2, this.currentBlock.y);
        } else if (accuracy > 80) {
            points = 3;
            this.showMessage('Great! ⭐', this.currentBlock.x + this.currentBlock.width / 2, this.currentBlock.y);
        } else if (accuracy > 60) {
            points = 2;
        }
        
        this.score += points;

        if (this.score % 5 === 0) {
            this.blockSpeed += 0.3;
        }
        
        this.updateStats();
        if (this.blocks.length > 20) {
            this.shiftBlocksDown();
        }
        
        this.createNewBlock();
    }
    
    calculateOverlap(block1, block2) {
        const left1 = block1.x;
        const right1 = block1.x + block1.width;
        const left2 = block2.x;
        const right2 = block2.x + block2.width;
        
        const overlapLeft = Math.max(left1, left2);
        const overlapRight = Math.min(right1, right2);
        
        return Math.max(0, overlapRight - overlapLeft);
    }
    
    shiftBlocksDown() {
        this.blocks.shift();
        this.blocks.forEach(block => {
            block.y += this.blockHeight + 5;
        });
    }
    
    showMessage(text, x, y) {
        const message = {
            text,
            x,
            y,
            opacity: 1,
            life: 60
        };
        
        const animate = () => {
            if (message.life <= 0) return;
            
            this.ctx.save();
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = `rgba(255, 215, 0, ${message.opacity})`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(message.text, message.x, message.y);
            this.ctx.restore();
            
            message.y -= 1;
            message.opacity -= 0.02;
            message.life--;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.currentBlock && this.currentBlock.moving) {
            this.currentBlock.x += this.blockSpeed * this.direction;
            if (this.currentBlock.x <= 0 || 
                this.currentBlock.x + this.currentBlock.width >= this.canvas.width) {
                this.direction *= -1;
            }
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawClouds();
        
        this.blocks.forEach((block, index) => {
            this.drawBlock(block, index);
        });
        
        if (this.currentBlock && this.currentBlock.moving) {
            this.drawBlock(this.currentBlock, this.blocks.length);
        }
    }
    
    drawBlock(block, index) {
        this.ctx.fillStyle = block.color;
        this.ctx.fillRect(block.x, block.y, block.width, this.blockHeight);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(block.x, block.y, block.width, 5);
        
        if (index >= this.blocks.length - 3) {
            this.drawSteam(block.x + block.width / 2, block.y);
        }
    }
    
    drawSteam(x, y) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(x - 5, y - 5, 3, 0, Math.PI * 2);
        this.ctx.arc(x + 5, y - 8, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(100, 80, 30, 0, Math.PI * 2);
        this.ctx.arc(130, 80, 35, 0, Math.PI * 2);
        this.ctx.arc(160, 80, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width - 100, 120, 25, 0, Math.PI * 2);
        this.ctx.arc(this.canvas.width - 75, 120, 30, 0, Math.PI * 2);
        this.ctx.arc(this.canvas.width - 50, 120, 25, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    updateStats() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('bestScore').textContent = this.bestScore;
        document.getElementById('totalBonuses').textContent = this.totalBonuses;
    }
    
    gameOver() {
        this.isPlaying = false;
        const bonusesEarned = Math.floor(this.score / 2);
        this.totalBonuses += bonusesEarned;

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        
        localStorage.setItem('totalBonuses', this.totalBonuses);

        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('bonusesEarned').textContent = bonusesEarned;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        this.updateStats();
    }
}

let game;

function startGame() {
    if (!game) {
        game = new CoffeeTowerGame();
    }
    game.start();
}

function restartGame() {
    game.start();
}

function goBackToMenu() {
    window.location.href = 'categories.html';
}

function updateGameLanguage() {
    const lang = localStorage.getItem("lang") || "ru";
    const elements = document.querySelectorAll('[data-lang-ru]');
    
    elements.forEach(el => {
        const text = lang === "ru" 
            ? el.getAttribute('data-lang-ru')
            : el.getAttribute('data-lang-en');
        
        if (el.tagName === 'BUTTON' || el.tagName === 'SPAN') {
            el.textContent = text;
        } else {
            el.textContent = text;
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    updateGameLanguage();
    game = new CoffeeTowerGame();
});