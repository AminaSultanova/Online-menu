class CoffeeTowerGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.isPlaying = false;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.totalBonuses = parseInt(localStorage.getItem('dessertBonuses')) || 0;
        
        this.blocks = [];
        this.currentBlock = null;
        this.blockWidth = 80;
        this.blockHeight = 30;
        this.baseSpeed = 2;
        this.blockSpeed = 2;
        this.direction = 1;
        this.maxBlocks = 15;
        
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
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isPlaying) {
                e.preventDefault();
                this.placeBlock();
            }
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
        this.blockSpeed = this.baseSpeed;
        this.direction = 1;
        
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
        if (this.blocks.length === 0) return;
        
        const prevBlock = this.blocks[this.blocks.length - 1];
        
        const newY = prevBlock.y - this.blockHeight - 5;
        
        if (newY < 50) {
            this.shiftBlocksDown();
        }
        
        const finalY = this.blocks.length > 0 
            ? this.blocks[this.blocks.length - 1].y - this.blockHeight - 5
            : this.canvas.height - this.blockHeight;
        
        this.direction = Math.random() > 0.5 ? 1 : -1;
        
        const startX = this.direction > 0 
            ? 0 
            : this.canvas.width - this.blockWidth;
        
        this.currentBlock = {
            x: startX,
            y: finalY,
            width: prevBlock.width,
            color: this.colors[this.blocks.length % this.colors.length],
            moving: true
        };
        
        console.log('New block created at:', this.currentBlock.x, this.currentBlock.y, 'Direction:', this.direction);
    }
    
    placeBlock() {
        if (!this.isPlaying || !this.currentBlock || !this.currentBlock.moving) {
            console.log('Cannot place block:', {
                isPlaying: this.isPlaying,
                hasBlock: !!this.currentBlock,
                isMoving: this.currentBlock?.moving
            });
            return;
        }
        
        this.currentBlock.moving = false;
        const prevBlock = this.blocks[this.blocks.length - 1];
        
        const overlap = this.calculateOverlap(this.currentBlock, prevBlock);
        
        console.log('Overlap:', overlap, 'Current X:', this.currentBlock.x);
        
        if (overlap <= 5) {
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
            this.currentBlock.width = Math.min(currRight - prevLeft, prevBlock.width);
        } else if (currRight > prevRight) {
            this.currentBlock.width = Math.min(prevRight - currLeft, prevBlock.width);
        }
        
        this.blocks.push({...this.currentBlock});
        
        const accuracy = (overlap / prevBlock.width) * 100;
        let points = 1;
        
        if (accuracy > 95) {
            points = 5;
            this.showMessage('Perfect! 🎉', this.currentBlock.x + this.currentBlock.width / 2, this.currentBlock.y);
        } else if (accuracy > 85) {
            points = 3;
            this.showMessage('Great! ⭐', this.currentBlock.x + this.currentBlock.width / 2, this.currentBlock.y);
        } else if (accuracy > 70) {
            points = 2;
            this.showMessage('Good! 👍', this.currentBlock.x + this.currentBlock.width / 2, this.currentBlock.y);
        }
        
        this.score += points;
        
        if (this.score % 10 === 0 && this.blockSpeed < 5) {
            this.blockSpeed += 0.2;
        }
        
        this.updateStats();
        
        setTimeout(() => {
            this.createNewBlock();
        }, 100);
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
        const shiftAmount = this.blockHeight * 3;
        this.blocks.forEach(block => {
            block.y += shiftAmount;
        });
        console.log('Shifted blocks down by', shiftAmount);
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
            
            const leftEdge = 0;
            const rightEdge = this.canvas.width - this.currentBlock.width;
            
            if (this.currentBlock.x <= leftEdge) {
                this.currentBlock.x = leftEdge;
                this.direction = 1;
            } else if (this.currentBlock.x >= rightEdge) {
                this.currentBlock.x = rightEdge;
                this.direction = -1;
            }
        }
    }
    
    draw() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawClouds();
        
        this.blocks.forEach((block, index) => {
            this.drawBlock(block, index);
        });

        if (this.currentBlock && this.currentBlock.moving) {
            this.drawBlock(this.currentBlock, this.blocks.length, true);
        }
        
        this.ctx.save();
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = 'rgba(62, 44, 28, 0.8)';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Высота: ${this.blocks.length}`, 10, 30);
        this.ctx.restore();
    }
    
    drawBlock(block, index, isMoving = false) {
        if (!isMoving) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fillRect(block.x + 2, block.y + 2, block.width, this.blockHeight);
        }
        
        this.ctx.fillStyle = block.color;
        this.ctx.fillRect(block.x, block.y, block.width, this.blockHeight);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(block.x, block.y, block.width, 5);
        
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(block.x, block.y, block.width, this.blockHeight);
        
        if (index >= this.blocks.length - 3 && !isMoving) {
            this.drawSteam(block.x + block.width / 2, block.y);
        }

        if (isMoving) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(block.x, block.y, block.width, this.blockHeight);
        }
    }
    
    drawSteam(x, y) {
        const time = Date.now() / 500;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        
        this.ctx.beginPath();
        this.ctx.arc(x - 8 + Math.sin(time) * 2, y - 5 - Math.abs(Math.sin(time)) * 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + Math.cos(time) * 2, y - 10 - Math.abs(Math.cos(time)) * 3, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + 8 + Math.sin(time + 1) * 2, y - 7 - Math.abs(Math.sin(time + 1)) * 3, 2.5, 0, Math.PI * 2);
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
        
        localStorage.setItem('dessertBonuses', this.totalBonuses);
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('bonusesEarned').textContent = bonusesEarned;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        this.updateStats();
        
        console.log('Game Over! Score:', this.score, 'Bonuses:', bonusesEarned);
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
        
        if (text) {
            el.textContent = text;
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    updateGameLanguage();
    game = new CoffeeTowerGame();
});