// AWS Cloud Farm - Main Game Engine

class CloudFarmGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.gameState = {
            day: 1,
            credits: 100,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            inventory: [],
            plantedServices: [],
            unlockedAchievements: [],
            dailyTaskProgress: {},
            quizStreak: 0,
            totalQuizzes: 0,
            npcInteractions: []
        };

        // Player
        this.player = {
            x: 15,
            y: 10,
            size: 1,
            speed: 0.15,
            emoji: '🧑‍🌾'
        };

        // Current quiz
        this.currentQuiz = null;
        this.quizQuestions = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.quizScore = 0;

        // Input
        this.keys = {};
        this.setupInput();

        // UI references
        this.setupUI();

        // Load saved game or start new
        this.loadGame();

        // Animation
        this.lastFrameTime = 0;
        this.animationFrame = null;

        // Interaction
        this.nearbyNPC = null;
    }

    setupUI() {
        // Title screen
        document.getElementById('start-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('continue-game').addEventListener('click', () => this.continueGame());
        document.getElementById('about-game').addEventListener('click', () => this.showAbout());

        // Quiz modal
        document.getElementById('close-quiz').addEventListener('click', () => this.closeQuiz());
        document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());

        // Dialog modal
        document.getElementById('close-dialog').addEventListener('click', () => this.closeDialog());

        // Shop modal
        document.getElementById('close-shop').addEventListener('click', () => this.closeShop());
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Interaction
            if (e.key === ' ' && this.nearbyNPC) {
                e.preventDefault();
                this.interactWithNPC(this.nearbyNPC);
            }

            // Shop
            if (e.key.toLowerCase() === 'e') {
                this.openShop();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    startNewGame() {
        this.gameState = {
            day: 1,
            credits: 100,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            inventory: [],
            plantedServices: [],
            unlockedAchievements: [],
            dailyTaskProgress: { quiz: 0, social: 0, farming: 0 },
            quizStreak: 0,
            totalQuizzes: 0,
            npcInteractions: []
        };

        this.showGame();
        this.saveGame();
    }

    continueGame() {
        this.loadGame();
        this.showGame();
    }

    showGame() {
        document.getElementById('title-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');

        this.resizeCanvas();
        this.updateUI();
        this.start();

        // Show welcome tip
        setTimeout(() => {
            this.showNotification(getRandomTip());
        }, 1000);
    }

    showAbout() {
        alert(`AWS Cloud Farm v1.0

A Stardew Valley-inspired game to help you master the AWS Certified Cloud Practitioner exam!

How to Play:
- Use ARROW KEYS or WASD to move
- Press SPACE to interact with NPCs
- Press E to open the service shop
- Complete quizzes to earn cloud credits and XP
- Plant AWS services to grow your cloud farm
- Unlock new zones and services as you level up

Goal: Master all AWS CCP exam topics and become a Cloud Architect!

Created with ☁️ for AWS learners everywhere.`);
    }

    resizeCanvas() {
        const gameArea = document.getElementById('game-area');
        this.canvas.width = gameArea.clientWidth;
        this.canvas.height = gameArea.clientHeight;
    }

    start() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Player movement
        let moved = false;
        const moveX = this.player.x;
        const moveY = this.player.y;

        if (this.keys['arrowup'] || this.keys['w']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
            moved = true;
        }
        if (this.keys['arrowdown'] || this.keys['s']) {
            this.player.y = Math.min(gameData.mapLayout.height - 1, this.player.y + this.player.speed);
            moved = true;
        }
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
            moved = true;
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.player.x = Math.min(gameData.mapLayout.width - 1, this.player.x + this.player.speed);
            moved = true;
        }

        // Check for nearby NPCs
        this.checkNearbyNPCs();
    }

    checkNearbyNPCs() {
        const interactionDistance = 1.5;
        const unlockedNPCs = getUnlockedNPCs(this.gameState.level);

        this.nearbyNPC = null;

        for (const npc of unlockedNPCs) {
            const distance = Math.sqrt(
                Math.pow(this.player.x - npc.position.x, 2) +
                Math.pow(this.player.y - npc.position.y, 2)
            );

            if (distance < interactionDistance) {
                this.nearbyNPC = npc;
                break;
            }
        }

        // Show/hide interaction prompt
        const prompt = document.getElementById('interaction-prompt');
        if (this.nearbyNPC) {
            prompt.classList.remove('hidden');
        } else {
            prompt.classList.add('hidden');
        }
    }

    render() {
        const tileSize = Math.min(
            this.canvas.width / gameData.mapLayout.width,
            this.canvas.height / gameData.mapLayout.height
        );

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw zones
        for (const zone of gameData.mapLayout.layers.zones) {
            this.ctx.fillStyle = zone.color + '33';
            this.ctx.fillRect(
                zone.x * tileSize,
                zone.y * tileSize,
                zone.width * tileSize,
                zone.height * tileSize
            );

            // Zone label
            this.ctx.fillStyle = zone.color;
            this.ctx.font = 'bold 16px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                zone.name,
                (zone.x + zone.width / 2) * tileSize,
                (zone.y + 1) * tileSize
            );
        }

        // Draw grid
        this.ctx.strokeStyle = '#ffffff11';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= gameData.mapLayout.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * tileSize, 0);
            this.ctx.lineTo(x * tileSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= gameData.mapLayout.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * tileSize);
            this.ctx.lineTo(this.canvas.width, y * tileSize);
            this.ctx.stroke();
        }

        // Draw planted services
        this.ctx.font = `${tileSize * 0.8}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        for (const planted of this.gameState.plantedServices) {
            const service = getServiceById(planted.serviceId);
            if (service) {
                this.ctx.fillText(
                    service.emoji,
                    planted.x * tileSize + tileSize / 2,
                    planted.y * tileSize + tileSize / 2
                );
            }
        }

        // Draw NPCs
        const unlockedNPCs = getUnlockedNPCs(this.gameState.level);
        for (const npc of unlockedNPCs) {
            this.ctx.fillText(
                npc.emoji,
                npc.position.x * tileSize + tileSize / 2,
                npc.position.y * tileSize + tileSize / 2
            );

            // NPC name on hover
            if (this.nearbyNPC && this.nearbyNPC.id === npc.id) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(
                    npc.position.x * tileSize - 30,
                    npc.position.y * tileSize - 25,
                    120,
                    20
                );
                this.ctx.fillStyle = '#000000';
                this.ctx.font = '12px monospace';
                this.ctx.fillText(
                    npc.name,
                    npc.position.x * tileSize + tileSize / 2,
                    npc.position.y * tileSize - 15
                );
                this.ctx.font = `${tileSize * 0.8}px monospace`;
            }
        }

        // Draw player
        this.ctx.fillText(
            this.player.emoji,
            this.player.x * tileSize + tileSize / 2,
            this.player.y * tileSize + tileSize / 2
        );
    }

    interactWithNPC(npc) {
        if (!npc) return;

        // Track interaction for daily tasks
        if (!this.gameState.npcInteractions.includes(npc.id)) {
            this.gameState.npcInteractions.push(npc.id);
            this.updateDailyTask('social', 1);
        }

        // Show dialog
        const dialogIndex = Math.floor(Math.random() * npc.dialogs.length);
        this.showDialog(npc, npc.dialogs[dialogIndex]);
    }

    showDialog(npc, text) {
        const modal = document.getElementById('dialog-modal');
        document.getElementById('npc-portrait').textContent = npc.emoji;
        document.getElementById('npc-name').textContent = npc.name;
        document.getElementById('dialog-text').textContent = text;
        modal.classList.remove('hidden');

        // Auto-offer quiz after dialog
        setTimeout(() => {
            if (confirm(`Would you like to take a ${npc.name} quiz to earn cloud credits?`)) {
                this.closeDialog();
                this.startQuiz(npc.quizCategory);
            }
        }, 100);
    }

    closeDialog() {
        document.getElementById('dialog-modal').classList.add('hidden');
    }

    startQuiz(category) {
        this.currentQuiz = category;
        this.quizQuestions = category === 'mixed'
            ? getMixedQuestions(10)
            : getRandomQuestions(category, 5);
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.quizScore = 0;

        if (this.quizQuestions.length === 0) {
            alert('No questions available for this category!');
            return;
        }

        this.showQuestion();
        document.getElementById('quiz-modal').classList.remove('hidden');
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.quizQuestions.length) {
            this.finishQuiz();
            return;
        }

        const question = this.quizQuestions[this.currentQuestionIndex];

        document.getElementById('quiz-title').textContent =
            `Question ${this.currentQuestionIndex + 1} of ${this.quizQuestions.length}`;
        document.getElementById('question-text').textContent = question.question;

        const answersDiv = document.getElementById('answers');
        answersDiv.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const div = document.createElement('div');
            div.className = 'answer-option';
            div.textContent = answer;
            div.onclick = () => this.selectAnswer(index);
            answersDiv.appendChild(div);
        });

        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('submit-answer').classList.remove('hidden');
        document.getElementById('next-question').classList.add('hidden');
        this.selectedAnswer = null;
    }

    selectAnswer(index) {
        this.selectedAnswer = index;

        const options = document.querySelectorAll('.answer-option');
        options.forEach((opt, i) => {
            opt.classList.remove('selected');
            if (i === index) {
                opt.classList.add('selected');
            }
        });
    }

    submitAnswer() {
        if (this.selectedAnswer === null) {
            alert('Please select an answer!');
            return;
        }

        const question = this.quizQuestions[this.currentQuestionIndex];
        const correct = this.selectedAnswer === question.correct;

        if (correct) {
            this.quizScore++;
        }

        // Show feedback
        const options = document.querySelectorAll('.answer-option');
        options.forEach((opt, i) => {
            if (i === question.correct) {
                opt.classList.add('correct');
            } else if (i === this.selectedAnswer) {
                opt.classList.add('incorrect');
            }
        });

        const feedback = document.getElementById('quiz-feedback');
        feedback.classList.remove('hidden');
        feedback.className = 'quiz-feedback ' + (correct ? 'correct' : 'incorrect');
        feedback.textContent = correct
            ? '✅ Correct! ' + question.explanation
            : '❌ Incorrect. ' + question.explanation;

        document.getElementById('submit-answer').classList.add('hidden');
        document.getElementById('next-question').classList.remove('hidden');
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    finishQuiz() {
        const totalQuestions = this.quizQuestions.length;
        const percentage = Math.round((this.quizScore / totalQuestions) * 100);
        const passed = percentage >= 70;

        // Calculate rewards
        const baseReward = 20;
        const bonusReward = this.quizScore * 10;
        const totalReward = baseReward + bonusReward;

        // Award credits and XP
        if (passed) {
            this.gameState.credits += totalReward;
            this.addXP(this.quizScore * 15);
            this.gameState.quizStreak++;
        } else {
            this.gameState.quizStreak = 0;
        }

        this.gameState.totalQuizzes++;
        this.updateDailyTask('quiz', 1);

        // Check achievements
        this.checkQuizAchievements(percentage);

        // Show results
        const resultText = `
Quiz Complete! 🎓

Score: ${this.quizScore}/${totalQuestions} (${percentage}%)
${passed ? '✅ Passed!' : '❌ Failed (70% required to pass)'}

${passed ? `Rewards:
☁️ +${totalReward} Cloud Credits
⭐ +${this.quizScore * 15} XP
🔥 Streak: ${this.gameState.quizStreak}` : 'Keep studying and try again!'}
`;

        alert(resultText);
        this.closeQuiz();
        this.updateUI();
        this.saveGame();
    }

    checkQuizAchievements(percentage) {
        // First quiz
        if (this.gameState.totalQuizzes === 1) {
            this.unlockAchievement('first-quiz');
        }

        // Perfect score
        if (percentage === 100) {
            if (this.currentQuiz === 'ec2') {
                this.unlockAchievement('ec2-master');
            } else if (this.currentQuiz === 'storage') {
                this.unlockAchievement('s3-expert');
            } else if (this.currentQuiz === 'security') {
                this.unlockAchievement('security-expert');
            }

            if (this.quizQuestions.length >= 10) {
                this.unlockAchievement('perfect-score');
            }
        }

        // Quiz streak
        if (this.gameState.quizStreak >= 5) {
            this.unlockAchievement('quiz-streak');
        }
    }

    closeQuiz() {
        document.getElementById('quiz-modal').classList.add('hidden');
        this.currentQuiz = null;
    }

    openShop() {
        const modal = document.getElementById('shop-modal');
        const itemsDiv = document.getElementById('shop-items');
        itemsDiv.innerHTML = '';

        const unlockedServices = getUnlockedServices(this.gameState.level);

        for (const service of unlockedServices) {
            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="shop-item-icon">${service.emoji}</div>
                <div class="shop-item-name">${service.name}</div>
                <div class="shop-item-price">☁️ ${service.cost}</div>
            `;

            if (this.gameState.credits >= service.cost) {
                div.onclick = () => this.buyService(service);
            } else {
                div.classList.add('locked');
            }

            itemsDiv.appendChild(div);
        }

        modal.classList.remove('hidden');
    }

    buyService(service) {
        if (this.gameState.credits < service.cost) {
            alert('Not enough cloud credits!');
            return;
        }

        // Find empty spot near player
        const plantX = Math.floor(this.player.x);
        const plantY = Math.floor(this.player.y);

        this.gameState.credits -= service.cost;
        this.gameState.plantedServices.push({
            serviceId: service.id,
            x: plantX,
            y: plantY,
            plantedDay: this.gameState.day
        });

        this.addXP(service.xpReward);
        this.updateDailyTask('farming', 1);

        this.showNotification(`✅ Planted ${service.name}!`);
        this.updateUI();
        this.saveGame();

        // Check if all services planted
        if (this.gameState.plantedServices.length >= gameData.services.length) {
            this.unlockAchievement('all-services');
        }
    }

    closeShop() {
        document.getElementById('shop-modal').classList.add('hidden');
    }

    addXP(amount) {
        this.gameState.xp += amount;

        while (this.gameState.xp >= this.gameState.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.gameState.xp -= this.gameState.xpToNextLevel;
        this.gameState.level++;
        this.gameState.xpToNextLevel = Math.floor(this.gameState.xpToNextLevel * 1.5);

        this.showNotification(`🎉 Level Up! You are now level ${this.gameState.level}!`);

        // Check level achievements
        if (this.gameState.level === 5) {
            this.unlockAchievement('level-5');
        }
        if (this.gameState.level === 10) {
            this.unlockAchievement('level-10');
        }

        this.updateUI();
    }

    updateDailyTask(category, amount) {
        this.gameState.dailyTaskProgress[category] =
            (this.gameState.dailyTaskProgress[category] || 0) + amount;

        const task = gameData.dailyTasks.find(t => t.category === category);
        if (task && this.gameState.dailyTaskProgress[category] >= task.target) {
            // Task complete - award bonus
            if (!this.gameState.dailyTaskProgress[category + '_complete']) {
                this.gameState.credits += task.reward;
                this.showNotification(`✅ Daily task complete! +${task.reward} credits`);
                this.gameState.dailyTaskProgress[category + '_complete'] = true;
                this.updateUI();
            }
        }
    }

    unlockAchievement(achievementId) {
        if (this.gameState.unlockedAchievements.includes(achievementId)) {
            return;
        }

        const achievement = getAchievementById(achievementId);
        if (achievement) {
            this.gameState.unlockedAchievements.push(achievementId);
            this.showNotification(`🏆 Achievement Unlocked: ${achievement.emoji} ${achievement.name}`);
            this.updateUI();
        }
    }

    showNotification(message) {
        // Simple notification using alert - can be enhanced later
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-size: 1rem;
                z-index: 2000;
                animation: slideUp 0.3s ease-out;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }, 100);
    }

    updateUI() {
        document.getElementById('day-counter').textContent = this.gameState.day;
        document.getElementById('credits').textContent = this.gameState.credits;
        document.getElementById('level').textContent = this.gameState.level;

        const xpPercentage = (this.gameState.xp / this.gameState.xpToNextLevel) * 100;
        document.getElementById('xp-bar').style.width = xpPercentage + '%';
        document.getElementById('xp-text').textContent =
            `${this.gameState.xp}/${this.gameState.xpToNextLevel}`;

        // Update inventory
        const inventoryDiv = document.getElementById('inventory');
        inventoryDiv.innerHTML = this.gameState.plantedServices.length > 0
            ? this.gameState.plantedServices.slice(-6).map(p => {
                const service = getServiceById(p.serviceId);
                return `<div class="inventory-item">${service.emoji}</div>`;
            }).join('')
            : '<div style="opacity: 0.5; grid-column: span 3; text-align: center;">Empty</div>';

        // Update tasks
        const tasksDiv = document.getElementById('tasks');
        tasksDiv.innerHTML = gameData.dailyTasks.map(task => {
            const progress = this.gameState.dailyTaskProgress[task.category] || 0;
            const complete = progress >= task.target;
            return `<div class="task">${complete ? '✅' : '⏳'} ${task.description} (${Math.min(progress, task.target)}/${task.target})</div>`;
        }).join('');

        // Update achievements
        const achievementsDiv = document.getElementById('achievements');
        achievementsDiv.innerHTML = gameData.achievements.slice(0, 6).map(achievement => {
            const unlocked = this.gameState.unlockedAchievements.includes(achievement.id);
            return `<div class="achievement ${unlocked ? 'unlocked' : 'locked'}">${achievement.emoji} ${achievement.name}</div>`;
        }).join('');

        // Check credit milestone
        if (this.gameState.credits >= 1000) {
            this.unlockAchievement('rich-farmer');
        }
    }

    saveGame() {
        try {
            localStorage.setItem('cloudFarmSave', JSON.stringify(this.gameState));
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    loadGame() {
        try {
            const saved = localStorage.getItem('cloudFarmSave');
            if (saved) {
                this.gameState = JSON.parse(saved);
                return true;
            }
        } catch (e) {
            console.error('Failed to load game:', e);
        }
        return false;
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new CloudFarmGame();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game && game.canvas) {
        game.resizeCanvas();
    }
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
@keyframes slideUp {
    from {
        transform: translateX(-50%) translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);
