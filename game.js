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
        // Isometric tile dimensions
        const baseSize = Math.min(
            this.canvas.width / (gameData.mapLayout.width + gameData.mapLayout.height),
            this.canvas.height / (gameData.mapLayout.width + gameData.mapLayout.height)
        );

        const tileWidth = baseSize * 2;
        const tileHeight = baseSize;

        // Offset to center the map
        const offsetX = this.canvas.width / 2;
        const offsetY = this.canvas.height / 4;

        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a1929');
        gradient.addColorStop(0.5, '#132f4c');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Convert 2D coords to isometric
        const toIso = (x, y) => {
            return {
                x: offsetX + (x - y) * (tileWidth / 2),
                y: offsetY + (x + y) * (tileHeight / 2)
            };
        };

        // Draw all elements in correct depth order (back to front)
        const renderItems = [];

        // Add zone tiles
        for (const zone of gameData.mapLayout.layers.zones) {
            for (let tx = zone.x; tx < zone.x + zone.width; tx++) {
                for (let ty = zone.y; ty < zone.y + zone.height; ty++) {
                    renderItems.push({
                        type: 'tile',
                        x: tx,
                        y: ty,
                        zone: zone,
                        depth: tx + ty
                    });
                }
            }
        }

        // Add planted services
        for (const planted of this.gameState.plantedServices) {
            renderItems.push({
                type: 'service',
                x: planted.x,
                y: planted.y,
                data: planted,
                depth: planted.x + planted.y + 0.5
            });
        }

        // Add NPCs
        const unlockedNPCs = getUnlockedNPCs(this.gameState.level);
        for (const npc of unlockedNPCs) {
            renderItems.push({
                type: 'npc',
                x: npc.position.x,
                y: npc.position.y,
                data: npc,
                depth: npc.position.x + npc.position.y + 0.5
            });
        }

        // Add player
        renderItems.push({
            type: 'player',
            x: this.player.x,
            y: this.player.y,
            depth: this.player.x + this.player.y + 0.6
        });

        // Sort by depth (painter's algorithm)
        renderItems.sort((a, b) => a.depth - b.depth);

        // Render all items
        for (const item of renderItems) {
            const iso = toIso(item.x, item.y);

            if (item.type === 'tile') {
                this.drawIsometricTile(iso.x, iso.y, tileWidth, tileHeight, item.zone.color);
            } else if (item.type === 'service') {
                const service = getServiceById(item.data.serviceId);
                if (service) {
                    this.drawIsometricSprite(iso.x, iso.y, service.emoji, tileWidth, '#4CAF50');
                }
            } else if (item.type === 'npc') {
                this.drawIsometricSprite(iso.x, iso.y, item.data.emoji, tileWidth, '#667eea');

                // NPC name on hover
                if (this.nearbyNPC && this.nearbyNPC.id === item.data.id) {
                    this.drawNameTag(iso.x, iso.y - tileHeight, item.data.name);
                }
            } else if (item.type === 'player') {
                this.drawIsometricSprite(iso.x, iso.y, this.player.emoji, tileWidth, '#FFD700', true);
            }
        }

        // Draw zone labels
        for (const zone of gameData.mapLayout.layers.zones) {
            const centerIso = toIso(
                zone.x + zone.width / 2,
                zone.y + zone.height / 2
            );
            this.drawZoneLabel(centerIso.x, centerIso.y - tileHeight * 2, zone.name, zone.color);
        }
    }

    drawIsometricTile(x, y, width, height, color) {
        this.ctx.save();
        this.ctx.beginPath();

        // Draw diamond shape for isometric tile
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width / 2, y + height / 2);
        this.ctx.lineTo(x, y + height);
        this.ctx.lineTo(x - width / 2, y + height / 2);
        this.ctx.closePath();

        // Fill with gradient
        const gradient = this.ctx.createLinearGradient(x - width / 2, y, x + width / 2, y + height);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(0.5, color + '60');
        gradient.addColorStop(1, color + '30');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Subtle border
        this.ctx.strokeStyle = color + '80';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();
    }

    drawIsometricSprite(x, y, emoji, tileWidth, glowColor, isPlayer = false) {
        this.ctx.save();

        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + tileWidth / 4, tileWidth / 4, tileWidth / 8, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Glow effect
        if (isPlayer || this.nearbyNPC) {
            this.ctx.shadowColor = glowColor;
            this.ctx.shadowBlur = 20;
        }

        // Sprite with elevation
        const spriteY = y - tileWidth / 3;
        this.ctx.font = `${tileWidth / 2}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Add subtle bounce animation for player
        if (isPlayer) {
            const bounce = Math.sin(Date.now() / 200) * 3;
            this.ctx.fillText(emoji, x, spriteY + bounce);
        } else {
            this.ctx.fillText(emoji, x, spriteY);
        }

        this.ctx.restore();
    }

    drawNameTag(x, y, name) {
        this.ctx.save();

        // Measure text
        this.ctx.font = 'bold 14px Segoe UI';
        const metrics = this.ctx.measureText(name);
        const padding = 8;
        const width = metrics.width + padding * 2;
        const height = 24;

        // Background with glassmorphism
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 10;

        this.roundRect(x - width / 2, y - height / 2, width, height, 8);
        this.ctx.fill();

        // Border
        this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Text
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(name, x, y);

        this.ctx.restore();
    }

    drawZoneLabel(x, y, name, color) {
        this.ctx.save();

        this.ctx.font = 'bold 18px Segoe UI';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Text shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 2;

        // Gradient text
        const gradient = this.ctx.createLinearGradient(x - 50, y, x + 50, y);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + 'cc');
        this.ctx.fillStyle = gradient;
        this.ctx.fillText(name, x, y);

        this.ctx.restore();
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
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
