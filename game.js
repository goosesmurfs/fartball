// AWS Tower Defense - Main Game Engine

class CloudFarmGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Game state with Tower Defense mechanics
        this.gameState = {
            day: 1,
            credits: 150, // Start with more for tower defense
            level: 1,
            xp: 0,
            xpToNextLevel: 100,

            // Tower Defense Stats
            lives: 20,
            currentWave: 0,
            waveInProgress: false,
            towersUnlocked: [], // Tower IDs unlocked via quizzes

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

            // Tower Defense - Placed towers
            placedTowers: [],

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

        // Tower Defense: Active enemies
        this.enemies = [];
        this.projectiles = [];
        this.enemyIdCounter = 0;
        this.projectileIdCounter = 0;

        // Tower Defense: Wave spawning
        this.waveEnemyQueue = [];
        this.nextSpawnTime = 0;

        // Tower Defense: Selection
        this.selectedBuildSpot = null;
        this.hoveredBuildSpot = null;
        this.selectedTowerType = null;

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

        // Environmental effects
        this.floatingClouds = this.generateClouds();
        this.floatingTexts = [];

        // Tower Defense: Build spots (from tower-defense-data.js)
        this.buildSpots = towerDefenseData.buildSpots;
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

            // Hotkeys
            if (e.key.toLowerCase() === 'e') {
                this.openTowerShop();
            }
            if (e.key.toLowerCase() === 'c') {
                this.openCharacterSheet();
            }
            if (e.key.toLowerCase() === 'q') {
                this.openQuestLog();
            }

            // Tower Defense: Start wave
            if (e.key.toLowerCase() === ' ' || e.key.toLowerCase() === 'w') {
                e.preventDefault();
                this.startNextWave();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Tower Defense: Mouse click handling for build spots
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleBuildSpotClick(x, y);
        });

        // Tower Defense: Mouse move for hover effects
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleBuildSpotHover(x, y);
        });
    }

    startNewGame() {
        this.gameState = {
            day: 1,
            credits: 150,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,

            // Tower Defense Stats
            lives: 20,
            currentWave: 0,
            waveInProgress: false,
            towersUnlocked: ['waf-tower', 'cloudfront-tower'], // Start with 2 basic towers

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

            // Tower Defense - Placed towers
            placedTowers: [],

            inventory: [],
            plantedServices: [],
            unlockedAchievements: [],
            dailyTaskProgress: { quiz: 0, social: 0, defense: 0 },
            quizStreak: 0,
            totalQuizzes: 0,
            npcInteractions: [],
            perfectScores: 0,
            title: 'Novice'
        };

        // Reset tower defense state
        this.enemies = [];
        this.projectiles = [];
        this.waveEnemyQueue = [];
        this.enemyIdCounter = 0;
        this.projectileIdCounter = 0;
        this.selectedBuildSpot = null;
        this.hoveredBuildSpot = null;
        this.selectedTowerType = null;

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
        alert(`AWS Tower Defense v1.0

A tower defense game to help you master the AWS Certified Cloud Practitioner exam!

How to Play:
- Click build spots to place AWS security towers
- Press SPACE or W to start the next wave
- Press E to open the tower shop
- Complete quizzes to unlock new AWS towers
- Defend against cloud security threats
- Survive waves to level up and earn credits

Towers are AWS Services:
- WAF, Shield, CloudFront protect against attacks
- GuardDuty detects threats
- Auto Scaling handles traffic spikes

Goal: Master AWS security concepts and survive all waves!

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

        // Tower Defense: Spawn enemies from wave queue
        if (this.gameState.waveInProgress && this.waveEnemyQueue.length > 0) {
            if (Date.now() >= this.nextSpawnTime) {
                const enemyConfig = this.waveEnemyQueue.shift();
                this.spawnEnemy(enemyConfig.type);

                if (this.waveEnemyQueue.length > 0) {
                    this.nextSpawnTime = Date.now() + this.waveEnemyQueue[0].delay;
                }
            }
        }

        // Tower Defense: Update enemies
        this.updateEnemies(deltaTime);

        // Tower Defense: Update towers (shooting)
        this.updateTowers(deltaTime);

        // Tower Defense: Update projectiles
        this.updateProjectiles(deltaTime);

        // Tower Defense: Check collisions
        this.checkCollisions();

        // Update particles
        this.updateParticles(deltaTime);

        // Update clouds
        this.updateClouds(deltaTime);

        // Update floating texts
        this.updateFloatingTexts(deltaTime);

        // Check if wave is complete
        if (this.gameState.waveInProgress &&
            this.waveEnemyQueue.length === 0 &&
            this.enemies.length === 0) {
            this.completeWave();
        }

        // Check for game over
        if (this.gameState.lives <= 0 && !this.gameOver) {
            this.endGame(false);
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
        // Tower Defense rendering

        // Clear canvas with animated gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        const skyShift = Math.sin(this.time * 0.5) * 0.1;
        gradient.addColorStop(0, this.lerpColor('#87CEEB', '#98d8f4', skyShift));
        gradient.addColorStop(0.5, this.lerpColor('#6FB1D0', '#7fc1e0', skyShift));
        gradient.addColorStop(1, this.lerpColor('#5A9FB5', '#6aafc5', skyShift));
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw path
        this.drawPath();

        // Draw build spots
        this.drawBuildSpots();

        // Draw towers
        this.drawTowers();

        // Draw enemies
        this.drawEnemies();

        // Draw projectiles
        this.drawProjectiles();

        // Draw particles
        this.drawParticles();

        // Draw floating texts
        this.drawFloatingTexts();

        // Draw wave info
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.roundRect(10, 15, 180, 40, 8);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Wave ${this.gameState.currentWave}/10`, 25, 40);
        this.ctx.restore();

        // Draw lives indicator
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.roundRect(200, 15, 120, 40, 8);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = this.gameState.lives > 5 ? '#4CAF50' : '#FF4444';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`❤️ ${this.gameState.lives}`, 215, 40);
        this.ctx.restore();

        // Draw help text
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.textAlign = 'left';
        const helpText = this.gameState.waveInProgress
            ? '🎓 Complete quizzes (press E) to unlock towers • Click build spots to place towers'
            : '🎮 Press SPACE or W to start next wave • Complete quizzes to unlock towers';
        this.ctx.fillText(helpText, 20, this.canvas.height - 20);
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

            // Tower Defense: Unlock towers based on quiz category
            const towersToUnlock = towerDefenseData.towers.filter(tower =>
                tower.quizCategory === this.currentQuiz &&
                !this.gameState.towersUnlocked.includes(tower.id)
            );

            towersToUnlock.forEach(tower => {
                this.gameState.towersUnlocked.push(tower.id);
                this.showNotification(`🎉 Tower Unlocked: ${tower.emoji} ${tower.name}!`);
            });
        } else {
            this.gameState.quizStreak = 0;
        }

        this.gameState.totalQuizzes++;
        this.updateDailyTask('quiz', 1);

        // Check achievements
        this.checkQuizAchievements(percentage);

        // Build result text with tower unlocks
        let resultText = `
Quiz Complete! 🎓

Score: ${this.quizScore}/${totalQuestions} (${percentage}%)
${passed ? '✅ Passed!' : '❌ Failed (70% required to pass)'}

${passed ? `Rewards:
☁️ +${totalReward} Cloud Credits
⭐ +${this.quizScore * 15} XP
🔥 Streak: ${this.gameState.quizStreak}` : 'Keep studying and try again!'}
`;

        // Add tower unlock info
        if (passed && towersToUnlock.length > 0) {
            resultText += `\n\n🗼 New Towers Unlocked:\n`;
            towersToUnlock.forEach(tower => {
                resultText += `${tower.emoji} ${tower.name}\n`;
            });
        }

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

                // Migrate old saves for Tower Defense system
                if (!loadedState.lives && loadedState.lives !== 0) {
                    loadedState.lives = 20;
                    loadedState.currentWave = 0;
                    loadedState.waveInProgress = false;
                    loadedState.towersUnlocked = ['waf-tower', 'cloudfront-tower'];
                    loadedState.placedTowers = [];
                }

                this.gameState = loadedState;

                // Reset tower defense runtime state
                this.enemies = [];
                this.projectiles = [];
                this.waveEnemyQueue = [];
                this.enemyIdCounter = 0;
                this.projectileIdCounter = 0;

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

    // ==================== Tower Defense Mechanics ====================

    handleBuildSpotClick(x, y) {
        // Find clicked build spot
        const spot = this.getBuildSpotAtPosition(x, y);
        if (!spot) return;

        if (spot.occupied) {
            this.showNotification('❌ Build spot already occupied!');
            return;
        }

        // Show tower selection or place tower if one is selected
        if (this.selectedTowerType) {
            this.placeTower(spot, this.selectedTowerType);
            this.selectedTowerType = null;
        } else {
            this.openTowerShop(spot);
        }
    }

    handleBuildSpotHover(x, y) {
        const spot = this.getBuildSpotAtPosition(x, y);
        this.hoveredBuildSpot = spot;
        this.canvas.style.cursor = spot ? 'pointer' : 'default';
    }

    getBuildSpotAtPosition(x, y) {
        const radius = 20;
        for (const spot of this.buildSpots) {
            const dist = Math.sqrt(Math.pow(x - spot.x, 2) + Math.pow(y - spot.y, 2));
            if (dist <= radius) {
                return spot;
            }
        }
        return null;
    }

    openTowerShop(buildSpot = null) {
        if (buildSpot) {
            this.selectedBuildSpot = buildSpot;
        }

        const modal = document.getElementById('shop-modal');
        const itemsDiv = document.getElementById('shop-items');
        itemsDiv.innerHTML = '';

        // Show unlocked towers
        const unlockedTowerIds = this.gameState.towersUnlocked;
        const unlockedTowers = towerDefenseData.towers.filter(t =>
            unlockedTowerIds.includes(t.id) && t.unlockLevel <= this.gameState.level
        );

        for (const tower of unlockedTowers) {
            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="shop-item-icon">${tower.emoji}</div>
                <div class="shop-item-name">${tower.name}</div>
                <div class="shop-item-price">☁️ ${tower.cost}</div>
                <div style="font-size: 11px; color: #888; margin-top: 4px;">${tower.description}</div>
            `;

            if (this.gameState.credits >= tower.cost) {
                div.onclick = () => {
                    if (this.selectedBuildSpot) {
                        this.placeTower(this.selectedBuildSpot, tower.id);
                        this.closeTowerShop();
                    } else {
                        this.selectedTowerType = tower.id;
                        this.showNotification(`✓ ${tower.name} selected. Click a build spot to place.`);
                        this.closeTowerShop();
                    }
                };
            } else {
                div.classList.add('locked');
            }

            itemsDiv.appendChild(div);
        }

        // Add locked towers with quiz unlock info
        const lockedTowers = towerDefenseData.towers.filter(t =>
            !unlockedTowerIds.includes(t.id) || t.unlockLevel > this.gameState.level
        );

        for (const tower of lockedTowers.slice(0, 3)) {
            const div = document.createElement('div');
            div.className = 'shop-item locked';
            div.innerHTML = `
                <div class="shop-item-icon" style="filter: grayscale(1);">${tower.emoji}</div>
                <div class="shop-item-name">${tower.name}</div>
                <div style="font-size: 11px; color: #FF6B6B; margin-top: 4px;">🎓 Complete ${tower.quizCategory} quiz to unlock</div>
            `;

            div.onclick = () => {
                if (confirm(`📚 ${tower.name} requires completing the ${tower.quizCategory.toUpperCase()} quiz.\n\nTake the quiz now?`)) {
                    this.closeTowerShop();
                    this.startQuiz(tower.quizCategory);
                }
            };

            itemsDiv.appendChild(div);
        }

        modal.classList.remove('hidden');
    }

    closeTowerShop() {
        document.getElementById('shop-modal').classList.add('hidden');
        this.selectedBuildSpot = null;
    }

    placeTower(buildSpot, towerId) {
        const towerData = getTowerById(towerId);
        if (!towerData) return;

        // Check if unlocked
        if (!this.gameState.towersUnlocked.includes(towerId)) {
            this.showNotification(`🔒 Complete ${towerData.quizCategory} quiz to unlock ${towerData.name}!`);
            return;
        }

        // Check cost
        if (this.gameState.credits < towerData.cost) {
            this.showNotification('❌ Not enough credits!');
            return;
        }

        // Deduct cost
        this.gameState.credits -= towerData.cost;

        // Create tower instance
        const tower = {
            id: `tower-${this.gameState.placedTowers.length}`,
            type: towerId,
            x: buildSpot.x,
            y: buildSpot.y,
            lastShot: 0,
            target: null,
            ...towerData
        };

        this.gameState.placedTowers.push(tower);
        buildSpot.occupied = true;

        // Create particles
        for (let i = 0; i < 10; i++) {
            this.createParticle(buildSpot.x, buildSpot.y, 'sparkle');
        }

        this.showNotification(`✅ ${towerData.name} placed!`);
        this.updateUI();
        this.saveGame();
    }

    startNextWave() {
        if (this.gameState.waveInProgress) {
            this.showNotification('⚠️ Wave already in progress!');
            return;
        }

        if (this.gameState.currentWave >= towerDefenseData.waves.length) {
            this.endGame(true);
            return;
        }

        this.gameState.currentWave++;
        this.gameState.waveInProgress = true;

        const waveData = getWave(this.gameState.currentWave);
        if (!waveData) {
            this.showNotification('❌ No wave data found!');
            return;
        }

        // Build enemy spawn queue
        this.waveEnemyQueue = [];
        let currentDelay = 1000; // 1 second before first enemy

        waveData.enemies.forEach(group => {
            const enemyType = getEnemyById(group.type);
            if (!enemyType) return;

            for (let i = 0; i < group.count; i++) {
                this.waveEnemyQueue.push({
                    type: group.type,
                    delay: currentDelay
                });
                currentDelay += group.spawnInterval;
            }
        });

        this.nextSpawnTime = Date.now() + 1000;

        this.showNotification(`🌊 Wave ${this.gameState.currentWave}: ${waveData.name}`);
        this.updateUI();
    }

    spawnEnemy(enemyTypeId) {
        const enemyData = getEnemyById(enemyTypeId);
        if (!enemyData) return;

        const path = towerDefenseData.path;
        const startPoint = path[0];

        const enemy = {
            id: `enemy-${this.enemyIdCounter++}`,
            type: enemyTypeId,
            x: startPoint.x,
            y: startPoint.y,
            health: enemyData.health,
            maxHealth: enemyData.health,
            speed: enemyData.speed,
            pathIndex: 0,
            distanceToNext: 0,
            emoji: enemyData.emoji,
            reward: enemyData.reward,
            enemyType: enemyData.type
        };

        this.enemies.push(enemy);
    }

    updateEnemies(deltaTime) {
        const path = towerDefenseData.path;

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            // Move enemy along path
            if (enemy.pathIndex < path.length - 1) {
                const current = path[enemy.pathIndex];
                const next = path[enemy.pathIndex + 1];

                const dx = next.x - enemy.x;
                const dy = next.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 5) {
                    // Reached waypoint
                    enemy.pathIndex++;
                } else {
                    // Move towards next waypoint
                    const moveDistance = enemy.speed * (deltaTime / 16);
                    enemy.x += (dx / distance) * moveDistance;
                    enemy.y += (dy / distance) * moveDistance;
                }
            } else {
                // Reached end - damage player
                this.gameState.lives--;
                this.enemies.splice(i, 1);
                this.showNotification(`💔 -1 Life! (${this.gameState.lives} remaining)`);
                this.createFloatingText(enemy.x, enemy.y, '-1 LIFE', '#FF4444', 24);

                // Create explosion particles
                for (let j = 0; j < 20; j++) {
                    this.createParticle(enemy.x, enemy.y, 'sparkle');
                }
            }
        }
    }

    updateTowers(deltaTime) {
        const now = Date.now();

        for (const tower of this.gameState.placedTowers) {
            // Check if tower can shoot
            if (now - tower.lastShot < tower.fireRate) continue;

            // Find target
            let target = null;
            let closestDistance = tower.range;

            for (const enemy of this.enemies) {
                // Type matching for efficiency
                if (tower.targetType !== 'all' && tower.targetType !== enemy.enemyType) {
                    continue;
                }

                const distance = Math.sqrt(
                    Math.pow(tower.x - enemy.x, 2) +
                    Math.pow(tower.y - enemy.y, 2)
                );

                if (distance < closestDistance) {
                    target = enemy;
                    closestDistance = distance;
                }
            }

            // Shoot at target
            if (target) {
                this.shootProjectile(tower, target);
                tower.lastShot = now;
            }
        }
    }

    shootProjectile(tower, target) {
        const projectile = {
            id: `proj-${this.projectileIdCounter++}`,
            x: tower.x,
            y: tower.y,
            targetId: target.id,
            damage: tower.damage,
            speed: 8,
            effect: tower.effect,
            towerType: tower.type
        };

        this.projectiles.push(projectile);
    }

    updateProjectiles(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];

            // Find target
            const target = this.enemies.find(e => e.id === proj.targetId);

            if (!target) {
                // Target died or disappeared
                this.projectiles.splice(i, 1);
                continue;
            }

            // Move towards target
            const dx = target.x - proj.x;
            const dy = target.y - proj.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 10) {
                // Hit target
                this.hitEnemy(target, proj);
                this.projectiles.splice(i, 1);
            } else {
                // Move projectile
                const moveDistance = proj.speed * (deltaTime / 16);
                proj.x += (dx / distance) * moveDistance;
                proj.y += (dy / distance) * moveDistance;
            }
        }
    }

    hitEnemy(enemy, projectile) {
        enemy.health -= projectile.damage;

        // Create hit particles
        for (let i = 0; i < 5; i++) {
            this.createParticle(enemy.x, enemy.y, 'sparkle');
        }

        // Show damage text
        this.createFloatingText(enemy.x, enemy.y - 20, `-${projectile.damage}`, '#FF6B6B', 16);

        // Apply effects
        if (projectile.effect === 'slow') {
            enemy.speed *= 0.7;
        }

        // Check if enemy died
        if (enemy.health <= 0) {
            this.killEnemy(enemy);
        }
    }

    killEnemy(enemy) {
        // Award credits
        this.gameState.credits += enemy.reward;
        this.addXP(enemy.reward);

        // Show reward
        this.createFloatingText(enemy.x, enemy.y, `+${enemy.reward} ☁️`, '#4CAF50', 18);

        // Create death particles
        for (let i = 0; i < 15; i++) {
            this.createParticle(enemy.x, enemy.y, 'sparkle');
        }

        // Remove enemy
        const index = this.enemies.findIndex(e => e.id === enemy.id);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }

        // Update quest progress
        this.gameState.activeQuests.forEach(questId => {
            this.updateQuestProgress(questId, 'defense', 1);
        });

        this.updateUI();
    }

    checkCollisions() {
        // Collision detection is handled in updateProjectiles
    }

    completeWave() {
        this.gameState.waveInProgress = false;

        // Award wave completion bonus
        const bonus = 50 + (this.gameState.currentWave * 10);
        this.gameState.credits += bonus;
        this.addXP(bonus);

        this.showNotification(`✅ Wave ${this.gameState.currentWave} Complete! +${bonus} bonus credits!`);
        this.updateUI();
        this.saveGame();
    }

    endGame(victory) {
        this.gameOver = true;

        if (victory) {
            alert(`🎉 VICTORY! 🎉

You've defended against all waves!

Final Stats:
- Level: ${this.gameState.level}
- Credits: ${this.gameState.credits}
- Lives Remaining: ${this.gameState.lives}

You've mastered AWS cloud security!`);
            this.unlockAchievement('cloud-architect');
        } else {
            alert(`💔 GAME OVER 💔

Your cloud infrastructure was breached!

Final Stats:
- Wave Reached: ${this.gameState.currentWave}
- Level: ${this.gameState.level}
- Credits: ${this.gameState.credits}

Study AWS security and try again!`);
        }

        this.saveGame();
    }

    // ==================== Tower Defense Drawing Methods ====================

    drawPath() {
        const path = towerDefenseData.path;

        this.ctx.save();
        this.ctx.strokeStyle = '#8B7355';
        this.ctx.lineWidth = 40;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Draw path shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 5;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.stroke();

        // Draw path border
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = '#6B5345';
        this.ctx.lineWidth = 44;
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.stroke();

        // Draw path fill
        this.ctx.strokeStyle = '#A0826D';
        this.ctx.lineWidth = 36;
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.stroke();

        this.ctx.restore();

        // Draw start and end markers
        this.ctx.save();
        this.ctx.font = '32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Start
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillText('🚪', path[0].x, path[0].y);

        // End
        this.ctx.fillStyle = '#FF4444';
        this.ctx.fillText('🏁', path[path.length - 1].x, path[path.length - 1].y);

        this.ctx.restore();
    }

    drawBuildSpots() {
        for (const spot of this.buildSpots) {
            if (spot.occupied) continue;

            const isHovered = this.hoveredBuildSpot === spot;

            this.ctx.save();

            // Draw build spot circle
            this.ctx.beginPath();
            this.ctx.arc(spot.x, spot.y, 18, 0, Math.PI * 2);

            if (isHovered) {
                this.ctx.fillStyle = 'rgba(102, 126, 234, 0.4)';
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 3;
            } else {
                this.ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
                this.ctx.strokeStyle = '#667eea';
                this.ctx.lineWidth = 2;
            }

            this.ctx.fill();
            this.ctx.stroke();

            // Draw plus sign
            if (isHovered) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.font = 'bold 24px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('+', spot.x, spot.y);
            }

            this.ctx.restore();
        }
    }

    drawTowers() {
        for (const tower of this.gameState.placedTowers) {
            this.ctx.save();

            // Draw tower range (if hovered)
            if (this.hoveredBuildSpot && Math.abs(this.hoveredBuildSpot.x - tower.x) < 5 && Math.abs(this.hoveredBuildSpot.y - tower.y) < 5) {
                this.ctx.beginPath();
                this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
                this.ctx.fill();
                this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }

            // Draw tower base
            const gradient = this.ctx.createRadialGradient(tower.x, tower.y, 0, tower.x, tower.y, 25);
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
            gradient.addColorStop(1, 'rgba(102, 126, 234, 0.3)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(tower.x, tower.y, 25, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            // Draw tower emoji
            this.ctx.font = '32px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(tower.emoji, tower.x, tower.y);

            // Draw tower name
            this.ctx.font = 'bold 10px Arial';
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(tower.name, tower.x, tower.y + 35);

            this.ctx.restore();
        }
    }

    drawEnemies() {
        for (const enemy of this.enemies) {
            this.ctx.save();

            // Draw health bar
            const barWidth = 30;
            const barHeight = 4;
            const barX = enemy.x - barWidth / 2;
            const barY = enemy.y - 30;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);

            const healthPercent = enemy.health / enemy.maxHealth;
            this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : (healthPercent > 0.25 ? '#FFA500' : '#FF4444');
            this.ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

            // Draw enemy emoji
            this.ctx.font = '28px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            // Shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.ellipse(enemy.x, enemy.y + 15, 12, 4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Emoji with bounce animation
            const bounce = Math.sin(this.time * 5 + enemy.id.charCodeAt(0)) * 2;
            this.ctx.fillText(enemy.emoji, enemy.x, enemy.y + bounce);

            this.ctx.restore();
        }
    }

    drawProjectiles() {
        for (const proj of this.projectiles) {
            this.ctx.save();

            // Draw projectile based on tower type
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2);

            switch (proj.towerType) {
                case 'waf-tower':
                    this.ctx.fillStyle = '#4CAF50';
                    break;
                case 'cloudfront-tower':
                    this.ctx.fillStyle = '#2196F3';
                    break;
                case 'shield-tower':
                    this.ctx.fillStyle = '#FFD700';
                    break;
                default:
                    this.ctx.fillStyle = '#FF6B6B';
            }

            this.ctx.shadowColor = this.ctx.fillStyle;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    drawParticles() {
        for (const p of this.particles) {
            const alpha = p.life / p.maxLife;

            this.ctx.save();
            this.ctx.globalAlpha = alpha;

            if (p.type === 'dust') {
                this.ctx.fillStyle = '#8B7355';
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'sparkle') {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.shadowColor = '#FFD700';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }
    }

}

// Helper functions for tower defense data
function getTowerById(id) {
    return towerDefenseData.towers.find(t => t.id === id);
}

function getEnemyById(id) {
    return towerDefenseData.enemies.find(e => e.id === id);
}

function getWave(waveNumber) {
    return towerDefenseData.waves.find(w => w.wave === waveNumber);
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
