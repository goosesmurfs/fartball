// AWS Cloud Farm - Main Game Engine

class CloudFarmGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Game state with full RPG system and FarmVille mechanics
        this.gameState = {
            day: 1,
            credits: 100,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,

            // FarmVille Energy System
            energy: 100,
            maxEnergy: 100,
            lastEnergyUpdate: Date.now(),

            // RPG Stats
            stats: JSON.parse(JSON.stringify(rpgData.characterStats)),
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            },
            unlockedSkills: [],
            skillPoints: 0,

            // Quests
            activeQuests: [],
            completedQuests: [],
            questProgress: {},

            // FarmVille Farm Plots (grid-based)
            farmPlots: this.initializeFarmGrid(),

            // Inventory
            inventory: [],
            plantedServices: [], // Legacy support
            unlockedAchievements: [],
            dailyTaskProgress: {},
            quizStreak: 0,
            totalQuizzes: 0,
            npcInteractions: [],
            perfectScores: 0,

            // Titles
            title: 'Novice'
        };

        // Player with smooth movement
        this.player = {
            x: 15,
            y: 10,
            vx: 0, // velocity
            vy: 0,
            size: 1,
            speed: 0.2,
            maxSpeed: 0.2,
            acceleration: 0.015,
            friction: 0.85,
            emoji: '🧑‍🌾',
            direction: 'down',
            walkCycle: 0
        };

        // Camera with smooth following
        this.camera = {
            x: this.player.x,
            y: this.player.y,
            smoothing: 0.1
        };

        // Particle system
        this.particles = [];

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
        this.time = 0;

        // Interaction
        this.nearbyNPC = null;

        // Environmental effects
        this.floatingClouds = this.generateClouds();
        this.stars = this.generateStars();

        // FarmVille: Selected plot and planting mode
        this.selectedPlot = null;
        this.plantingMode = false;
        this.selectedService = null;
        this.hoveredNPC = null;

        // Better Gameplay: Combo and streak systems
        this.harvestStreak = 0;
        this.comboMultiplier = 1.0;
        this.lastHarvestTime = 0;
        this.floatingTexts = [];

        // FarmVille: Farm grid configuration
        this.farmGridConfig = {
            rows: 6,
            cols: 8,
            plotSize: 80,
            offsetX: 100,
            offsetY: 150
        };
    }

    // FarmVille: Initialize farm grid
    initializeFarmGrid() {
        const grid = [];
        const rows = 6;
        const cols = 8;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                grid.push({
                    id: `plot-${row}-${col}`,
                    row: row,
                    col: col,
                    unlocked: row < 3 && col < 4, // Start with 12 unlocked plots
                    state: 'empty', // empty, planted, growing, ready, harvested
                    serviceId: null,
                    plantedDay: null,
                    plantedTime: null,
                    growthProgress: 0,
                    growthRequired: 0 // Days or time to grow
                });
            }
        }

        return grid;
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
        document.getElementById('hud-shop-btn')?.addEventListener('click', () => this.openShop());

        // RPG modals
        document.getElementById('open-character')?.addEventListener('click', () => this.openCharacterSheet());
        document.getElementById('close-character')?.addEventListener('click', () => this.closeCharacterSheet());
        document.getElementById('open-quests')?.addEventListener('click', () => this.openQuestLog());
        document.getElementById('close-quests')?.addEventListener('click', () => this.closeQuestLog());
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Interaction
            if (e.key === ' ' && this.nearbyNPC) {
                e.preventDefault();
                this.interactWithNPC(this.nearbyNPC);
            }

            // Hotkeys
            if (e.key.toLowerCase() === 'e') {
                this.openShop();
            }
            if (e.key.toLowerCase() === 'c') {
                this.openCharacterSheet();
            }
            if (e.key.toLowerCase() === 'q') {
                this.openQuestLog();
            }

            // FarmVille: Next day (for testing)
            if (e.key.toLowerCase() === 'n') {
                this.advanceDay();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // FarmVille: Mouse click handling for plots
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handlePlotClick(x, y);
        });

        // FarmVille: Mouse move for hover effects
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handlePlotHover(x, y);
        });
    }

    startNewGame() {
        this.gameState = {
            day: 1,
            credits: 100,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,

            // FarmVille Energy System
            energy: 100,
            maxEnergy: 100,
            lastEnergyUpdate: Date.now(),

            // RPG Stats
            stats: JSON.parse(JSON.stringify(rpgData.characterStats)),
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            },
            unlockedSkills: [],
            skillPoints: 0,

            // Quests
            activeQuests: ['first-steps'], // Start with first quest
            completedQuests: [],
            questProgress: {
                'first-steps': { 'quiz': 0 }
            },

            // FarmVille Farm Plots
            farmPlots: this.initializeFarmGrid(),

            inventory: [],
            plantedServices: [],
            unlockedAchievements: [],
            dailyTaskProgress: { quiz: 0, social: 0, farming: 0 },
            quizStreak: 0,
            totalQuizzes: 0,
            npcInteractions: [],
            perfectScores: 0,
            title: 'Novice'
        };

        this.selectedPlot = null;
        this.plantingMode = false;
        this.selectedService = null;

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
        this.time += deltaTime * 0.001; // Convert to seconds

        // Smooth player movement with acceleration
        let targetVx = 0;
        let targetVy = 0;

        if (this.keys['arrowup'] || this.keys['w']) {
            targetVy = -this.player.maxSpeed;
            this.player.direction = 'up';
        }
        if (this.keys['arrowdown'] || this.keys['s']) {
            targetVy = this.player.maxSpeed;
            this.player.direction = 'down';
        }
        if (this.keys['arrowleft'] || this.keys['a']) {
            targetVx = -this.player.maxSpeed;
            this.player.direction = 'left';
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            targetVx = this.player.maxSpeed;
            this.player.direction = 'right';
        }

        // Apply acceleration
        this.player.vx += (targetVx - this.player.vx) * this.player.acceleration;
        this.player.vy += (targetVy - this.player.vy) * this.player.acceleration;

        // Apply friction when not moving
        if (targetVx === 0) this.player.vx *= this.player.friction;
        if (targetVy === 0) this.player.vy *= this.player.friction;

        // Update position with boundaries
        this.player.x = Math.max(0, Math.min(gameData.mapLayout.width - 1, this.player.x + this.player.vx));
        this.player.y = Math.max(0, Math.min(gameData.mapLayout.height - 1, this.player.y + this.player.vy));

        // Update walk cycle
        if (Math.abs(this.player.vx) > 0.01 || Math.abs(this.player.vy) > 0.01) {
            this.player.walkCycle += deltaTime * 0.01;

            // Create dust particles when walking
            if (Math.random() < 0.3) {
                this.createParticle(this.player.x, this.player.y, 'dust');
            }
        }

        // Smooth camera following
        this.camera.x += (this.player.x - this.camera.x) * this.camera.smoothing;
        this.camera.y += (this.player.y - this.camera.y) * this.camera.smoothing;

        // Update particles
        this.updateParticles(deltaTime);

        // Check for nearby NPCs
        this.checkNearbyNPCs();

        // Update clouds
        this.updateClouds(deltaTime);

        // FarmVille: Update energy regeneration
        this.updateEnergy();

        // Update floating texts
        this.updateFloatingTexts(deltaTime);

        // Update combo multiplier decay
        const now = Date.now();
        if (now - this.lastHarvestTime > 5000) { // 5 seconds timeout
            this.harvestStreak = 0;
            this.comboMultiplier = 1.0;
        }
    }

    generateClouds() {
        const clouds = [];
        for (let i = 0; i < 8; i++) {
            clouds.push({
                x: Math.random() * 40 - 5,
                y: Math.random() * 30 - 5,
                size: 20 + Math.random() * 30,
                speed: 0.002 + Math.random() * 0.003,
                opacity: 0.1 + Math.random() * 0.15
            });
        }
        return clouds;
    }

    generateStars() {
        const stars = [];
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * 40,
                y: Math.random() * 30,
                size: 1 + Math.random() * 2,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.002 + Math.random() * 0.003
            });
        }
        return stars;
    }

    updateClouds(deltaTime) {
        for (const cloud of this.floatingClouds) {
            cloud.x += cloud.speed * deltaTime * 0.1;
            if (cloud.x > 40) cloud.x = -10;
        }
    }

    createParticle(x, y, type) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.05,
            vy: (Math.random() - 0.5) * 0.05 - 0.02,
            life: 1,
            maxLife: 1,
            size: 2 + Math.random() * 3,
            type: type
        };
        this.particles.push(particle);
    }

    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.001; // gravity
            p.life -= deltaTime * 0.001;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
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
        // FarmVille-style rendering

        // Clear canvas with animated gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        const skyShift = Math.sin(this.time * 0.5) * 0.1;
        gradient.addColorStop(0, this.lerpColor('#87CEEB', '#98d8f4', skyShift));
        gradient.addColorStop(0.5, this.lerpColor('#6FB1D0', '#7fc1e0', skyShift));
        gradient.addColorStop(1, this.lerpColor('#5A9FB5', '#6aafc5', skyShift));
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw farm plots
        this.drawFarmPlots();

        // Draw NPCs (teachers)
        this.drawNPCs();

        // Draw particles
        this.drawFarmParticles();

        // Draw floating texts (rewards, combos)
        this.drawFloatingTexts();

        // Draw combo multiplier indicator
        if (this.comboMultiplier > 1.0) {
            this.ctx.save();
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#FFD700';
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 3;
            const comboText = `${this.harvestStreak}x COMBO! (${Math.floor(this.comboMultiplier * 100)}% bonus)`;
            this.ctx.strokeText(comboText, this.canvas.width / 2, 60);
            this.ctx.fillText(comboText, this.canvas.width / 2, 60);
            this.ctx.restore();
        }

        // Draw day counter and help text
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.roundRect(10, 15, 120, 40, 8);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`☀️ Day ${this.gameState.day}`, 25, 40);
        this.ctx.restore();

        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🎓 Click NPCs to learn AWS • 🌱 Click plots to farm • ⏭️ Press N for next day', 20, this.canvas.height - 20);
    }

    drawFarmPlots() {
        const cfg = this.farmGridConfig;

        for (const plot of this.gameState.farmPlots) {
            const x = cfg.offsetX + plot.col * cfg.plotSize;
            const y = cfg.offsetY + plot.row * cfg.plotSize;

            this.ctx.save();

            // Determine plot appearance
            if (!plot.unlocked) {
                // Locked plot
                this.ctx.fillStyle = '#444444';
                this.ctx.fillRect(x + 2, y + 2, cfg.plotSize - 4, cfg.plotSize - 4);

                this.ctx.strokeStyle = '#555555';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x + 2, y + 2, cfg.plotSize - 4, cfg.plotSize - 4);

                this.ctx.fillStyle = '#888888';
                this.ctx.font = '32px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('🔒', x + cfg.plotSize / 2, y + cfg.plotSize / 2);
            } else {
                // Unlocked plot
                const isHovered = this.selectedPlot === plot;

                // Enhanced background with gradient
                const gradient = this.ctx.createLinearGradient(x, y, x, y + cfg.plotSize);

                if (plot.state === 'ready') {
                    gradient.addColorStop(0, '#98FB98');
                    gradient.addColorStop(0.5, '#90EE90');
                    gradient.addColorStop(1, '#7CFC00');
                } else if (plot.state === 'growing' || plot.state === 'planted') {
                    gradient.addColorStop(0, '#B8926D');
                    gradient.addColorStop(0.5, '#A0826D');
                    gradient.addColorStop(1, '#8B7355');
                } else {
                    gradient.addColorStop(0, '#9B8365');
                    gradient.addColorStop(0.5, '#8B7355');
                    gradient.addColorStop(1, '#6B5345');
                }

                // Draw shadow for depth
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.fillRect(x + 4, y + 4, cfg.plotSize - 4, cfg.plotSize - 4);

                // Main plot
                if (isHovered) {
                    this.ctx.shadowColor = '#FFD700';
                    this.ctx.shadowBlur = 20;
                }

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x + 2, y + 2, cfg.plotSize - 4, cfg.plotSize - 4);

                this.ctx.shadowBlur = 0;

                // Enhanced border with 3D effect
                this.ctx.strokeStyle = isHovered ? '#FFD700' : '#6B5345';
                this.ctx.lineWidth = isHovered ? 4 : 2;
                this.ctx.strokeRect(x + 2, y + 2, cfg.plotSize - 4, cfg.plotSize - 4);

                // Inner highlight for 3D effect
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(x + 3, y + 3);
                this.ctx.lineTo(x + cfg.plotSize - 3, y + 3);
                this.ctx.moveTo(x + 3, y + 3);
                this.ctx.lineTo(x + 3, y + cfg.plotSize - 3);
                this.ctx.stroke();

                // Content based on state
                if (plot.state === 'empty') {
                    // Show plus sign for empty plots
                    if (isHovered) {
                        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                        this.ctx.font = '40px Arial';
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';
                        this.ctx.fillText('+', x + cfg.plotSize / 2, y + cfg.plotSize / 2);
                    }
                } else if (plot.state === 'planted') {
                    // Seedling stage
                    this.ctx.font = '32px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('🌱', x + cfg.plotSize / 2, y + cfg.plotSize / 2);

                    // Days left
                    const daysLeft = plot.growthRequired - plot.growthProgress;
                    this.ctx.fillStyle = '#000';
                    this.ctx.font = 'bold 12px Arial';
                    this.ctx.fillText(`${daysLeft}d`, x + cfg.plotSize / 2, y + cfg.plotSize - 15);
                } else if (plot.state === 'growing') {
                    // Growing stage
                    const service = getServiceById(plot.serviceId);
                    const growthPercent = plot.growthProgress / plot.growthRequired;

                    // Show growing emoji with progress
                    this.ctx.font = `${24 + growthPercent * 16}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(service?.emoji || '🌿', x + cfg.plotSize / 2, y + cfg.plotSize / 2);

                    // Progress bar
                    const barWidth = cfg.plotSize - 20;
                    const barHeight = 8;
                    const barX = x + 10;
                    const barY = y + cfg.plotSize - 15;

                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    this.ctx.fillRect(barX, barY, barWidth, barHeight);

                    this.ctx.fillStyle = '#4CAF50';
                    this.ctx.fillRect(barX, barY, barWidth * growthPercent, barHeight);

                    this.ctx.strokeStyle = '#000';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(barX, barY, barWidth, barHeight);

                    // Days left
                    const daysLeft = plot.growthRequired - plot.growthProgress;
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 10px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(`${daysLeft}d`, x + cfg.plotSize / 2, barY - 5);
                } else if (plot.state === 'ready') {
                    // Ready to harvest - show full size and sparkle
                    const service = getServiceById(plot.serviceId);

                    // Pulsing effect
                    const pulse = Math.sin(this.time * 3) * 0.1 + 1;
                    this.ctx.font = `${Math.floor(40 * pulse)}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';

                    // Glow effect
                    this.ctx.shadowColor = '#FFD700';
                    this.ctx.shadowBlur = 20;

                    this.ctx.fillText(service?.emoji || '✨', x + cfg.plotSize / 2, y + cfg.plotSize / 2);

                    this.ctx.shadowBlur = 0;

                    // Ready text
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.font = 'bold 14px Arial';
                    this.ctx.fillText('READY!', x + cfg.plotSize / 2, y + cfg.plotSize - 10);
                }
            }

            this.ctx.restore();
        }
    }

    drawNPCs() {
        const unlockedNPCs = getUnlockedNPCs(this.gameState.level);

        // Position NPCs around the farm in a nice layout
        const npcPositions = [
            { x: 800, y: 200 },   // Right side top
            { x: 800, y: 350 },   // Right side middle
            { x: 800, y: 500 },   // Right side bottom
            { x: 50, y: 200 },    // Left side top
            { x: 50, y: 350 },    // Left side middle
            { x: 50, y: 500 },    // Left side bottom
            { x: 400, y: 80 },    // Top center
            { x: 400, y: 650 }    // Bottom center
        ];

        unlockedNPCs.forEach((npc, index) => {
            if (index >= npcPositions.length) return;

            const pos = npcPositions[index];
            const isHovered = this.hoveredNPC === npc;

            this.ctx.save();

            // Floating animation
            const floatOffset = Math.sin(this.time * 2 + index) * 3;

            // Shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.beginPath();
            this.ctx.ellipse(pos.x, pos.y + 50, 35, 10, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Gradient background circle
            const gradient = this.ctx.createRadialGradient(pos.x, pos.y + floatOffset, 0, pos.x, pos.y + floatOffset, 50);

            if (isHovered) {
                gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
                gradient.addColorStop(0.7, 'rgba(102, 126, 234, 0.6)');
                gradient.addColorStop(1, 'rgba(102, 126, 234, 0.2)');
                this.ctx.shadowColor = '#FFD700';
                this.ctx.shadowBlur = 25;
            } else {
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                gradient.addColorStop(0.7, 'rgba(102, 126, 234, 0.8)');
                gradient.addColorStop(1, 'rgba(102, 126, 234, 0.3)');
            }

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y + floatOffset, 45, 0, Math.PI * 2);
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = isHovered ? '#FFD700' : '#667eea';
            this.ctx.lineWidth = isHovered ? 5 : 3;
            this.ctx.shadowBlur = 0;
            this.ctx.stroke();

            // NPC emoji with shadow
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = 5;
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(npc.emoji, pos.x, pos.y + floatOffset);

            // NPC name with background
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(pos.x - 45, pos.y + 52, 90, 20);

            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText(npc.name, pos.x, pos.y + 62);

            // Pulsing ring when hovered
            if (isHovered) {
                const pulse = Math.sin(this.time * 6) * 0.3 + 0.7;
                this.ctx.globalAlpha = pulse;
                for (let i = 0; i < 3; i++) {
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y + floatOffset, 52 + i * 4, 0, Math.PI * 2);
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }

            this.ctx.restore();

            // Store position for click detection
            npc.screenX = pos.x;
            npc.screenY = pos.y + floatOffset;
            npc.screenRadius = 45;
        });
    }

    drawFloatingTexts() {
        for (const text of this.floatingTexts) {
            this.ctx.save();
            this.ctx.globalAlpha = text.alpha;
            this.ctx.font = `bold ${text.size}px Arial`;
            this.ctx.textAlign = 'center';

            // Outline
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 4;
            this.ctx.strokeText(text.text, text.x, text.y);

            // Fill
            this.ctx.fillStyle = text.color;
            this.ctx.fillText(text.text, text.x, text.y);

            this.ctx.restore();
        }
    }

    updateFloatingTexts(deltaTime) {
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const text = this.floatingTexts[i];
            text.y -= text.speed * (deltaTime / 16);
            text.life -= deltaTime;
            text.alpha = Math.min(1, text.life / 1000);

            if (text.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    createFloatingText(x, y, text, color = '#FFD700', size = 20) {
        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            size: size,
            speed: 1.5,
            life: 2000,
            alpha: 1
        });
    }

    drawFarmParticles() {
        for (const p of this.particles) {
            const cfg = this.farmGridConfig;
            const x = cfg.offsetX + p.x * cfg.plotSize;
            const y = cfg.offsetY + p.y * cfg.plotSize;

            const alpha = p.life / p.maxLife;

            this.ctx.save();
            this.ctx.globalAlpha = alpha;

            if (p.type === 'dust') {
                this.ctx.fillStyle = '#8B7355';
                this.ctx.beginPath();
                this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'sparkle') {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.shadowColor = '#FFD700';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }
    }

    drawStars(offsetX, offsetY, tileWidth, tileHeight) {
        for (const star of this.stars) {
            const iso = {
                x: offsetX + (star.x - star.y) * (tileWidth / 2),
                y: offsetY + (star.x + star.y) * (tileHeight / 2)
            };

            star.twinkle += star.twinkleSpeed * 16; // frame-based
            const opacity = 0.3 + Math.sin(star.twinkle) * 0.3;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(iso.x, iso.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Star glow
            if (opacity > 0.5) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${(opacity - 0.5) * 0.3})`;
                this.ctx.beginPath();
                this.ctx.arc(iso.x, iso.y, star.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    drawClouds(offsetX, offsetY, tileWidth, tileHeight) {
        for (const cloud of this.floatingClouds) {
            const iso = {
                x: offsetX + (cloud.x - cloud.y) * (tileWidth / 2),
                y: offsetY + (cloud.x + cloud.y) * (tileHeight / 2)
            };

            this.ctx.save();
            this.ctx.globalAlpha = cloud.opacity;

            // Draw fluffy cloud
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(iso.x, iso.y, cloud.size * 0.6, 0, Math.PI * 2);
            this.ctx.arc(iso.x + cloud.size * 0.4, iso.y, cloud.size * 0.5, 0, Math.PI * 2);
            this.ctx.arc(iso.x - cloud.size * 0.4, iso.y, cloud.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    drawParticles(toIso, tileWidth) {
        for (const p of this.particles) {
            const iso = toIso(p.x, p.y);
            const alpha = p.life / p.maxLife;

            this.ctx.save();
            this.ctx.globalAlpha = alpha;

            if (p.type === 'dust') {
                this.ctx.fillStyle = '#8B7355';
                this.ctx.beginPath();
                this.ctx.arc(iso.x, iso.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'sparkle') {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.shadowColor = '#FFD700';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(iso.x, iso.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }
    }

    lerpColor(color1, color2, factor) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        return `rgb(${r}, ${g}, ${b})`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
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

        // Fill with enhanced gradient
        const gradient = this.ctx.createLinearGradient(x - width / 2, y, x + width / 2, y + height);
        gradient.addColorStop(0, color + '50');
        gradient.addColorStop(0.3, color + '70');
        gradient.addColorStop(0.7, color + '60');
        gradient.addColorStop(1, color + '40');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Add texture pattern
        this.ctx.globalAlpha = 0.15;
        this.ctx.fillStyle = this.createTilePattern(color);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;

        // Highlight edge
        this.ctx.strokeStyle = color + 'aa';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width / 2, y + height / 2);
        this.ctx.stroke();

        // Shadow edge
        this.ctx.strokeStyle = color + '40';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + height);
        this.ctx.lineTo(x - width / 2, y + height / 2);
        this.ctx.stroke();

        // Subtle border
        this.ctx.strokeStyle = color + '60';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width / 2, y + height / 2);
        this.ctx.lineTo(x, y + height);
        this.ctx.lineTo(x - width / 2, y + height / 2);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    createTilePattern(color) {
        // Create subtle noise pattern for tiles
        const hash = color.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
        const pattern = ((hash % 3) + 1) / 10;
        return `rgba(255, 255, 255, ${pattern})`;
    }

    drawIsometricSprite(x, y, emoji, tileWidth, glowColor, isPlayer = false) {
        this.ctx.save();

        // Enhanced shadow with gradient
        const shadowGradient = this.ctx.createRadialGradient(x, y + tileWidth / 4, 0, x, y + tileWidth / 4, tileWidth / 3);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = shadowGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + tileWidth / 4, tileWidth / 3, tileWidth / 9, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Sprite with elevation
        let spriteY = y - tileWidth / 3;

        // Add animation
        if (isPlayer) {
            // Smooth bouncing for player
            const bounce = Math.sin(this.time * 3) * 4;
            spriteY += bounce;

            // Walking tilt effect
            const speed = Math.sqrt(this.player.vx * this.player.vx + this.player.vy * this.player.vy);
            if (speed > 0.01) {
                const tilt = Math.sin(this.player.walkCycle) * 2;
                spriteY += tilt;
            }

            // Pulsing glow
            this.ctx.shadowColor = glowColor;
            this.ctx.shadowBlur = 25 + Math.sin(this.time * 2) * 5;

            // Outer glow ring
            const glowGradient = this.ctx.createRadialGradient(x, spriteY, 0, x, spriteY, tileWidth / 1.5);
            glowGradient.addColorStop(0, glowColor + '00');
            glowGradient.addColorStop(0.5, glowColor + '30');
            glowGradient.addColorStop(1, glowColor + '00');
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, spriteY, tileWidth / 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.nearbyNPC) {
            // Gentle glow for nearby NPCs
            this.ctx.shadowColor = glowColor;
            this.ctx.shadowBlur = 20;

            // Subtle float animation for NPCs
            spriteY += Math.sin(this.time * 1.5 + x) * 2;
        }

        // Draw sprite with better rendering
        this.ctx.font = `${tileWidth / 1.8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Add outline for better visibility
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(emoji, x, spriteY);

        // Draw the emoji
        this.ctx.fillText(emoji, x, spriteY);

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

        // BETTER LEARNING: Enhanced dialog with AWS context
        const awsContext = this.getAWSContext(npc.quizCategory);
        const enhancedText = `${text}\n\n💡 ${awsContext}`;

        document.getElementById('dialog-text').textContent = enhancedText;
        modal.classList.remove('hidden');

        // Auto-offer quiz after dialog
        setTimeout(() => {
            if (confirm(`🎓 Ready to test your ${npc.quizCategory.toUpperCase()} knowledge?\n\nTake the quiz to earn credits and XP!`)) {
                this.closeDialog();
                this.startQuiz(npc.quizCategory);
            }
        }, 100);
    }

    getAWSContext(category) {
        const contexts = {
            'ec2': 'EC2 (Elastic Compute Cloud) is like renting powerful computers in the cloud. You can scale up or down based on demand!',
            'storage': 'Amazon S3 stores your files as objects in buckets. Think of it as an unlimited hard drive in the cloud with 99.999999999% durability!',
            'lambda': 'Lambda lets you run code without managing servers. You only pay for the compute time you consume - perfect for event-driven apps!',
            'database': 'AWS offers managed databases (RDS) and NoSQL (DynamoDB). Let AWS handle backups, patches, and scaling while you focus on your data!',
            'networking': 'VPCs create isolated networks in the cloud. You control IP ranges, subnets, and security - just like your own data center!',
            'security': 'IAM controls who can access what in AWS. Follow the principle of least privilege - only grant the permissions actually needed!',
            'monitoring': 'CloudWatch is your eyes in the cloud. Monitor metrics, set alarms, and view logs to keep your applications healthy!',
            'pricing': 'AWS has pay-as-you-go pricing. Use cost calculators, set budgets, and take advantage of Reserved Instances for long-term savings!',
            'cloudConcepts': 'Cloud computing offers on-demand resources, scalability, and global reach. Master these concepts to become cloud-native!',
            'mixed': 'AWS Cloud Practitioner covers all core services. Understanding how they work together is key to building robust cloud solutions!'
        };

        return contexts[category] || 'Learn AWS to master cloud computing!';
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

            // RPG Integration: Update quest progress
            this.gameState.activeQuests.forEach(questId => {
                // General quiz completion
                this.updateQuestProgress(questId, 'quiz', 1);

                // Category-specific quiz completion
                if (this.currentQuiz) {
                    this.updateQuestProgress(questId, `quiz-category-${this.currentQuiz}`, 1);
                }

                // Perfect score tracking
                if (percentage === 100) {
                    this.updateQuestProgress(questId, 'perfect-score', 1);
                    this.gameState.perfectScores++;
                }
            });

            // Grant stats based on quiz category
            if (this.currentQuiz) {
                this.addStatForCategory(this.currentQuiz, 1);
            }
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
        // FarmVille mode: Plant on selected plot
        if (this.plantingMode && this.selectedPlot) {
            const success = this.plantService(this.selectedPlot, service);
            if (success) {
                this.closeShop();
                this.plantingMode = false;
                this.selectedPlot = null;
            }
            return;
        }

        // Legacy mode: Old planting system
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
        this.plantingMode = false;
        this.selectedPlot = null;
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

        // Use RPG experience curve if available
        const xpForNext = getXPForLevel ? getXPForLevel(this.gameState.level) : null;
        this.gameState.xpToNextLevel = xpForNext || Math.floor(this.gameState.xpToNextLevel * 1.5);

        // Show enhanced level-up notification
        this.showLevelUpNotification();

        // Recalculate stats with new level bonuses
        this.applyEquipmentStats();

        // Process level rewards from RPG data
        const rewards = getLevelRewards ? getLevelRewards(this.gameState.level) : null;
        if (rewards) {
            if (rewards.skillPoint) {
                this.gameState.skillPoints += rewards.skillPoint;
                this.showNotification(`💫 +${rewards.skillPoint} Skill Point!`);
            }
            if (rewards.credits) {
                this.gameState.credits += rewards.credits;
                this.showNotification(`☁️ +${rewards.credits} Credits!`);
            }
            if (rewards.statBonus) {
                Object.keys(rewards.statBonus).forEach(stat => {
                    if (this.gameState.stats[stat] !== undefined) {
                        this.gameState.stats[stat] += rewards.statBonus[stat];
                    }
                });
            }
            if (rewards.title) {
                this.gameState.title = rewards.title;
                this.showNotification(`🎖️ New Title: ${rewards.title}!`);
            }
            if (rewards.unlockNPC) {
                this.showNotification(`👤 New NPC Available: ${rewards.unlockNPC}!`);
            }
            if (rewards.unlockBoss) {
                this.showNotification(`⚔️ Boss Battle Unlocked: ${rewards.unlockBoss}!`);
            }
        }

        // Check for new quests to unlock
        this.checkNewQuests();

        // Check level achievements
        if (this.gameState.level === 5) {
            this.unlockAchievement('level-5');
        }
        if (this.gameState.level === 10) {
            this.unlockAchievement('level-10');
        }
        if (this.gameState.level === 20) {
            this.unlockAchievement('cloud-architect');
        }

        this.updateUI();
        this.saveGame();
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
        // Update HUD
        document.getElementById('credits').textContent = this.gameState.credits;
        document.getElementById('level').textContent = this.gameState.level;

        // Update HP bar (keep for RPG features)
        const stats = this.gameState.stats;
        const hpPercent = (stats.currentHealth / stats.maxHealth) * 100;
        document.getElementById('hp-bar').style.width = hpPercent + '%';
        document.getElementById('hp-display').textContent = `${Math.floor(stats.currentHealth)}/${stats.maxHealth}`;

        // Update Energy bar (FarmVille - replaces MP bar)
        const energyPercent = (this.gameState.energy / this.gameState.maxEnergy) * 100;
        document.getElementById('mp-bar').style.width = energyPercent + '%';
        document.getElementById('mp-display').textContent = `${Math.floor(this.gameState.energy)}/${this.gameState.maxEnergy}`;

        // Change MP label to Energy label
        const mpLabel = document.querySelector('.hud-vitals .vital-label:nth-child(4)');
        if (mpLabel && mpLabel.textContent.includes('MP')) {
            mpLabel.textContent = '⚡ Energy';
        }

        // Update XP bar
        const xpPercentage = (this.gameState.xp / this.gameState.xpToNextLevel) * 100;
        document.getElementById('xp-bar').style.width = xpPercentage + '%';
        document.getElementById('xp-text').textContent =
            `${this.gameState.xp}/${this.gameState.xpToNextLevel}`;

        // Update inventory
        const inventoryDiv = document.getElementById('inventory');
        if (inventoryDiv) {
            inventoryDiv.innerHTML = this.gameState.plantedServices.length > 0
                ? this.gameState.plantedServices.slice(-6).map(p => {
                    const service = getServiceById(p.serviceId);
                    return `<div class="inventory-item">${service.emoji}</div>`;
                }).join('')
                : '<div style="opacity: 0.5; grid-column: span 3; text-align: center;">Empty</div>';
        }

        // Update tasks
        const tasksDiv = document.getElementById('tasks');
        if (tasksDiv) {
            tasksDiv.innerHTML = gameData.dailyTasks.map(task => {
                const progress = this.gameState.dailyTaskProgress[task.category] || 0;
                const complete = progress >= task.target;
                return `<div class="task">${complete ? '✅' : '⏳'} ${task.description} (${Math.min(progress, task.target)}/${task.target})</div>`;
            }).join('');
        }

        // Update achievements
        const achievementsDiv = document.getElementById('achievements');
        if (achievementsDiv) {
            achievementsDiv.innerHTML = gameData.achievements.slice(0, 6).map(achievement => {
                const unlocked = this.gameState.unlockedAchievements.includes(achievement.id);
                return `<div class="achievement ${unlocked ? 'unlocked' : 'locked'}">${achievement.emoji} ${achievement.name}</div>`;
            }).join('');
        }

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
                const loadedState = JSON.parse(saved);

                // Migrate old saves for RPG system
                if (!loadedState.stats) {
                    loadedState.stats = JSON.parse(JSON.stringify(rpgData.characterStats));
                    loadedState.equipment = { weapon: null, armor: null, accessory: null };
                    loadedState.activeQuests = [];
                    loadedState.completedQuests = [];
                    loadedState.questProgress = {};
                    loadedState.skillPoints = 0;
                    loadedState.unlockedSkills = [];
                    loadedState.perfectScores = 0;
                    loadedState.title = 'Novice';
                }

                // Migrate old saves for FarmVille system
                if (!loadedState.farmPlots) {
                    loadedState.farmPlots = this.initializeFarmGrid();
                }
                if (!loadedState.energy && loadedState.energy !== 0) {
                    loadedState.energy = 100;
                    loadedState.maxEnergy = 100;
                    loadedState.lastEnergyUpdate = Date.now();
                }

                this.gameState = loadedState;
                return true;
            }
        } catch (e) {
            console.error('Failed to load game:', e);
        }
        return false;
    }

    // RPG System Methods

    openCharacterSheet() {
        const modal = document.getElementById('character-sheet');
        if (!modal) return;

        // Update character info
        document.getElementById('char-title').textContent = this.gameState.title;

        // Update stats
        const stats = this.gameState.stats;
        document.getElementById('hp-fill').style.width = (stats.currentHealth / stats.maxHealth * 100) + '%';
        document.getElementById('hp-text').textContent = `${Math.floor(stats.currentHealth)}/${stats.maxHealth}`;
        document.getElementById('mp-fill').style.width = (stats.currentMana / stats.maxMana * 100) + '%';
        document.getElementById('mp-text').textContent = `${Math.floor(stats.currentMana)}/${stats.maxMana}`;

        // Update AWS domain stats
        document.getElementById('stat-compute').textContent = stats.compute;
        document.getElementById('stat-storage').textContent = stats.storage;
        document.getElementById('stat-networking').textContent = stats.networking;
        document.getElementById('stat-security').textContent = stats.security;
        document.getElementById('stat-database').textContent = stats.database;

        // Update combat stats
        document.getElementById('stat-attack').textContent = stats.attack;
        document.getElementById('stat-defense').textContent = stats.defense;
        document.getElementById('stat-crit').textContent = stats.critChance;

        // Update equipment
        document.getElementById('slot-weapon').textContent = this.gameState.equipment.weapon
            ? getEquipmentById(this.gameState.equipment.weapon)?.emoji || '⚔️'
            : '⚔️';
        document.getElementById('slot-armor').textContent = this.gameState.equipment.armor
            ? getEquipmentById(this.gameState.equipment.armor)?.emoji || '🛡️'
            : '🛡️';
        document.getElementById('slot-accessory').textContent = this.gameState.equipment.accessory
            ? getEquipmentById(this.gameState.equipment.accessory)?.emoji || '💍'
            : '💍';

        // Update skill points
        document.getElementById('skill-points').textContent = this.gameState.skillPoints;

        modal.classList.remove('hidden');
    }

    closeCharacterSheet() {
        document.getElementById('character-sheet')?.classList.add('hidden');
    }

    openQuestLog() {
        const modal = document.getElementById('quest-log');
        if (!modal) return;

        const questList = document.getElementById('quest-list');
        const quests = [...this.gameState.activeQuests, ...this.gameState.completedQuests]
            .map(id => getQuestById(id))
            .filter(q => q && q.requiredLevel <= this.gameState.level);

        if (quests.length === 0) {
            questList.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No quests available yet. Keep playing!</p>';
        } else {
            questList.innerHTML = quests.map(quest => {
                const completed = this.gameState.completedQuests.includes(quest.id);
                const progress = this.gameState.questProgress[quest.id] || {};

                return `
                    <div class="quest-item ${quest.type} ${completed ? 'completed' : ''}">
                        <div class="quest-header">
                            <div class="quest-name">${quest.name}</div>
                            <div class="quest-type ${quest.type}">${quest.type}</div>
                        </div>
                        <div class="quest-description">${quest.description}</div>
                        <div class="quest-objectives">
                            ${quest.objectives.map(obj => {
                                const current = progress[obj.type] || 0;
                                const complete = current >= obj.target;
                                return `
                                    <div class="objective ${complete ? 'complete' : ''}">
                                        <span class="objective-icon">${complete ? '✅' : '⏳'}</span>
                                        <span>${obj.description}</span>
                                        <span class="objective-progress">${current}/${obj.target}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="quest-rewards">
                            ${quest.rewards.xp ? `<span class="reward-item">⭐ ${quest.rewards.xp} XP</span>` : ''}
                            ${quest.rewards.credits ? `<span class="reward-item">☁️ ${quest.rewards.credits} Credits</span>` : ''}
                            ${quest.rewards.skillPoint ? `<span class="reward-item">💫 ${quest.rewards.skillPoint} Skill Points</span>` : ''}
                            ${quest.rewards.equipment ? `<span class="reward-item">⚔️ Equipment</span>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }

        modal.classList.remove('hidden');
    }

    closeQuestLog() {
        document.getElementById('quest-log')?.classList.add('hidden');
    }

    updateQuestProgress(questId, objectiveType, amount = 1) {
        if (!this.gameState.activeQuests.includes(questId)) return;

        if (!this.gameState.questProgress[questId]) {
            this.gameState.questProgress[questId] = {};
        }

        this.gameState.questProgress[questId][objectiveType] =
            (this.gameState.questProgress[questId][objectiveType] || 0) + amount;

        this.checkQuestCompletion(questId);
    }

    checkQuestCompletion(questId) {
        const quest = getQuestById(questId);
        if (!quest) return;

        const progress = this.gameState.questProgress[questId] || {};
        const allComplete = quest.objectives.every(obj => {
            const current = progress[obj.type] || 0;
            return current >= obj.target;
        });

        if (allComplete && !this.gameState.completedQuests.includes(questId)) {
            this.completeQuest(questId);
        }
    }

    completeQuest(questId) {
        const quest = getQuestById(questId);
        if (!quest) return;

        // Move from active to completed
        this.gameState.activeQuests = this.gameState.activeQuests.filter(id => id !== questId);
        this.gameState.completedQuests.push(questId);

        // Grant rewards
        if (quest.rewards.xp) {
            this.addXP(quest.rewards.xp);
        }
        if (quest.rewards.credits) {
            this.gameState.credits += quest.rewards.credits;
        }
        if (quest.rewards.skillPoint) {
            this.gameState.skillPoints += quest.rewards.skillPoint;
        }
        if (quest.rewards.equipment) {
            const equipList = Array.isArray(quest.rewards.equipment)
                ? quest.rewards.equipment
                : [quest.rewards.equipment];

            equipList.forEach(equipId => {
                this.grantEquipment(equipId);
            });
        }
        if (quest.rewards.statBonus) {
            Object.keys(quest.rewards.statBonus).forEach(stat => {
                this.gameState.stats[stat] += quest.rewards.statBonus[stat];
            });
        }

        // Show completion notification
        this.showLootNotification(`Quest Complete: ${quest.name}`, quest.rewards);

        // Check for new quests to unlock
        this.checkNewQuests();

        this.updateUI();
        this.saveGame();
    }

    checkNewQuests() {
        rpgData.quests.forEach(quest => {
            if (quest.requiredLevel <= this.gameState.level &&
                !this.gameState.activeQuests.includes(quest.id) &&
                !this.gameState.completedQuests.includes(quest.id)) {

                this.gameState.activeQuests.push(quest.id);
                this.showNotification(`📜 New Quest: ${quest.name}`);
            }
        });
    }

    grantEquipment(equipId) {
        const equipment = getEquipmentById(equipId);
        if (!equipment) return;

        // Auto-equip if slot is empty
        const slot = rpgData.equipment.weapons.some(w => w.id === equipId) ? 'weapon' :
                     rpgData.equipment.armor.some(a => a.id === equipId) ? 'armor' : 'accessory';

        if (!this.gameState.equipment[slot]) {
            this.gameState.equipment[slot] = equipId;
            this.applyEquipmentStats();
        }

        this.gameState.inventory.push(equipId);
    }

    applyEquipmentStats() {
        // Recalculate stats based on equipment
        const baseStats = JSON.parse(JSON.stringify(rpgData.characterStats));

        // Add level bonuses
        baseStats.attack += this.gameState.level * 2;
        baseStats.defense += this.gameState.level;
        baseStats.maxHealth += this.gameState.level * 5;
        baseStats.maxMana += this.gameState.level * 2;

        // Add equipment bonuses
        Object.values(this.gameState.equipment).forEach(equipId => {
            if (equipId) {
                const equip = getEquipmentById(equipId);
                if (equip && equip.stats) {
                    Object.keys(equip.stats).forEach(stat => {
                        if (baseStats[stat] !== undefined) {
                            baseStats[stat] += equip.stats[stat];
                        }
                    });
                }
            }
        });

        // Maintain current HP/MP ratios
        const hpRatio = this.gameState.stats.currentHealth / this.gameState.stats.maxHealth;
        const mpRatio = this.gameState.stats.currentMana / this.gameState.stats.maxMana;

        this.gameState.stats = baseStats;
        this.gameState.stats.currentHealth = Math.min(baseStats.maxHealth, baseStats.maxHealth * hpRatio);
        this.gameState.stats.currentMana = Math.min(baseStats.maxMana, baseStats.maxMana * mpRatio);
    }

    showLootNotification(title, rewards) {
        const notification = document.createElement('div');
        notification.className = 'loot-notification';

        let rewardsHTML = '';
        if (rewards.xp) rewardsHTML += `<div class="loot-item">⭐ ${rewards.xp} XP</div>`;
        if (rewards.credits) rewardsHTML += `<div class="loot-item">☁️ ${rewards.credits} Credits</div>`;
        if (rewards.skillPoint) rewardsHTML += `<div class="loot-item">💫 ${rewards.skillPoint} Skill Points</div>`;
        if (rewards.equipment) {
            const equipList = Array.isArray(rewards.equipment) ? rewards.equipment : [rewards.equipment];
            equipList.forEach(equipId => {
                const equip = getEquipmentById(equipId);
                if (equip) {
                    rewardsHTML += `<div class="loot-item rarity-${equip.rarity}">${equip.emoji} ${equip.name}</div>`;
                }
            });
        }

        notification.innerHTML = `
            <div class="loot-title">${title}</div>
            ${rewardsHTML}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <h2>⭐ LEVEL UP! ⭐</h2>
            <span class="level-number">${this.gameState.level}</span>
            <p>You've grown stronger!</p>
        `;

        document.body.appendChild(notification);

        // Create sparkle particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle(this.player.x + (Math.random() - 0.5) * 2,
                                   this.player.y + (Math.random() - 0.5) * 2, 'sparkle');
            }, i * 50);
        }

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    addStatForCategory(category, amount) {
        const statMap = {
            'ec2': 'compute',
            'lambda': 'compute',
            'storage': 'storage',
            'database': 'database',
            'networking': 'networking',
            'security': 'security',
            'cloudConcepts': 'compute',
            'pricing': 'storage',
            'monitoring': 'database',
            'support': 'security'
        };

        const stat = statMap[category];
        if (stat && this.gameState.stats[stat] !== undefined) {
            this.gameState.stats[stat] += amount;
            this.applyEquipmentStats(); // Recalculate derived stats
            this.showNotification(`📊 +${amount} ${stat.charAt(0).toUpperCase() + stat.slice(1)}!`);
        }
    }

    // ==================== FarmVille Mechanics ====================

    handlePlotClick(x, y) {
        // Check for NPC click first
        const npc = this.getNPCAtPosition(x, y);
        if (npc) {
            this.interactWithNPC(npc);
            return;
        }

        // Then check for plot click
        const plot = this.getPlotAtPosition(x, y);
        if (!plot) return;

        if (!plot.unlocked) {
            this.showNotification('🔒 Unlock this plot by leveling up!');
            return;
        }

        if (plot.state === 'empty') {
            // Open shop to select service to plant
            this.openShopForPlanting(plot);
        } else if (plot.state === 'ready') {
            // Harvest the plot
            this.harvestPlot(plot);
        } else if (plot.state === 'growing' || plot.state === 'planted') {
            // Show growth info
            const service = getServiceById(plot.serviceId);
            const daysLeft = plot.growthRequired - plot.growthProgress;
            this.showNotification(`🌱 ${service?.name || 'Service'} growing... ${daysLeft} days left`);
        }
    }

    handlePlotHover(x, y) {
        // Check for NPC hover first
        const npc = this.getNPCAtPosition(x, y);
        this.hoveredNPC = npc;

        if (npc) {
            this.selectedPlot = null;
            this.canvas.style.cursor = 'pointer';
            return;
        }

        // Then check for plot hover
        const plot = this.getPlotAtPosition(x, y);
        this.selectedPlot = plot;
        this.canvas.style.cursor = plot && plot.unlocked ? 'pointer' : 'default';
    }

    getNPCAtPosition(x, y) {
        const unlockedNPCs = getUnlockedNPCs(this.gameState.level);

        for (const npc of unlockedNPCs) {
            if (npc.screenX && npc.screenY && npc.screenRadius) {
                const distance = Math.sqrt(
                    Math.pow(x - npc.screenX, 2) + Math.pow(y - npc.screenY, 2)
                );

                if (distance <= npc.screenRadius) {
                    return npc;
                }
            }
        }

        return null;
    }

    getPlotAtPosition(x, y) {
        const cfg = this.farmGridConfig;

        for (const plot of this.gameState.farmPlots) {
            const plotX = cfg.offsetX + plot.col * cfg.plotSize;
            const plotY = cfg.offsetY + plot.row * cfg.plotSize;

            if (x >= plotX && x < plotX + cfg.plotSize &&
                y >= plotY && y < plotY + cfg.plotSize) {
                return plot;
            }
        }

        return null;
    }

    openShopForPlanting(plot) {
        this.plantingMode = true;
        this.selectedPlot = plot;
        this.openShop();
    }

    plantService(plot, service) {
        // Check energy
        if (this.gameState.energy < 10) {
            this.showNotification('⚡ Not enough energy! Wait for energy to regenerate.');
            return false;
        }

        // Check cost
        if (this.gameState.credits < service.cost) {
            this.showNotification('❌ Not enough credits!');
            return false;
        }

        // Deduct cost and energy
        this.gameState.credits -= service.cost;
        this.gameState.energy -= 10;

        // Plant the service
        plot.state = 'planted';
        plot.serviceId = service.id;
        plot.plantedDay = this.gameState.day;
        plot.plantedTime = Date.now();
        plot.growthProgress = 0;
        plot.growthRequired = service.growthDays || 2; // Default 2 days

        // Create planting particles
        this.createParticle(plot.col + 0.5, plot.row + 0.5, 'sparkle');

        this.showNotification(`✅ Planted ${service.name}!`);
        this.updateDailyTask('farming', 1);
        this.updateUI();
        this.saveGame();

        return true;
    }

    harvestPlot(plot) {
        if (plot.state !== 'ready') return;

        // Check energy
        if (this.gameState.energy < 5) {
            this.showNotification('⚡ Not enough energy to harvest!');
            return;
        }

        const service = getServiceById(plot.serviceId);
        if (!service) return;

        // Deduct energy
        this.gameState.energy -= 5;

        // IMPROVED GAMEPLAY: Combo system
        const now = Date.now();
        if (now - this.lastHarvestTime < 5000) {
            // Within 5 seconds - continue combo
            this.harvestStreak++;
            this.comboMultiplier = Math.min(3.0, 1.0 + (this.harvestStreak * 0.15));
        } else {
            // Reset combo
            this.harvestStreak = 1;
            this.comboMultiplier = 1.0;
        }
        this.lastHarvestTime = now;

        // Calculate rewards with combo multiplier
        const baseHarvestReward = service.cost * 2;
        const baseXPReward = service.xpReward * 2;

        const harvestReward = Math.floor(baseHarvestReward * this.comboMultiplier);
        const xpReward = Math.floor(baseXPReward * this.comboMultiplier);

        this.gameState.credits += harvestReward;
        this.addXP(xpReward);

        // Calculate plot center for floating text
        const cfg = this.farmGridConfig;
        const plotCenterX = cfg.offsetX + (plot.col * cfg.plotSize) + (cfg.plotSize / 2);
        const plotCenterY = cfg.offsetY + (plot.row * cfg.plotSize) + (cfg.plotSize / 2);

        // Create floating texts for rewards
        this.createFloatingText(plotCenterX, plotCenterY - 20, `+${harvestReward} ☁️`, '#4CAF50', 22);
        this.createFloatingText(plotCenterX, plotCenterY, `+${xpReward} ⭐`, '#FFD700', 18);

        if (this.comboMultiplier > 1.0) {
            this.createFloatingText(plotCenterX, plotCenterY + 20, `${this.harvestStreak}x COMBO!`, '#FF4500', 20);
        }

        // Enhanced harvest particles
        for (let i = 0; i < 15; i++) {
            this.createParticle(plot.col + 0.5 + (Math.random() - 0.5),
                              plot.row + 0.5 + (Math.random() - 0.5), 'sparkle');
        }

        // Show harvest notification
        const comboText = this.comboMultiplier > 1.0 ? ` (${Math.floor(this.comboMultiplier * 100)}% combo!)` : '';
        this.showNotification(`✨ Harvested ${service.name}! +${harvestReward} credits, +${xpReward} XP${comboText}`);

        // Reset plot to empty
        plot.state = 'empty';
        plot.serviceId = null;
        plot.plantedDay = null;
        plot.plantedTime = null;
        plot.growthProgress = 0;
        plot.growthRequired = 0;

        // Update quest progress
        this.gameState.activeQuests.forEach(questId => {
            this.updateQuestProgress(questId, 'harvest', 1);
        });

        this.updateUI();
        this.saveGame();
    }

    updateGrowth() {
        let anyGrowth = false;

        for (const plot of this.gameState.farmPlots) {
            if (plot.state === 'planted' || plot.state === 'growing') {
                plot.growthProgress++;

                if (plot.growthProgress >= plot.growthRequired) {
                    plot.state = 'ready';
                    const service = getServiceById(plot.serviceId);
                    this.showNotification(`🎉 ${service?.name || 'Service'} is ready to harvest!`);
                    anyGrowth = true;
                } else {
                    plot.state = 'growing';
                }
            }
        }

        if (anyGrowth) {
            this.saveGame();
        }
    }

    updateEnergy() {
        const now = Date.now();
        const timeSince = now - this.gameState.lastEnergyUpdate;
        const minutesElapsed = timeSince / (1000 * 60);

        // Regenerate 1 energy per minute
        const energyToAdd = Math.floor(minutesElapsed);

        if (energyToAdd > 0) {
            this.gameState.energy = Math.min(
                this.gameState.maxEnergy,
                this.gameState.energy + energyToAdd
            );
            this.gameState.lastEnergyUpdate = now;
            this.updateUI();
        }
    }

    advanceDay() {
        this.gameState.day++;
        this.updateGrowth();

        // Restore some energy
        this.gameState.energy = Math.min(
            this.gameState.maxEnergy,
            this.gameState.energy + 50
        );

        // Reset daily tasks
        this.gameState.dailyTaskProgress = { quiz: 0, social: 0, farming: 0 };

        this.showNotification(`🌅 Day ${this.gameState.day} begins! Energy restored.`);
        this.updateUI();
        this.saveGame();
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
