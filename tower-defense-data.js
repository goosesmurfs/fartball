// Tower Defense Data - AWS Security Game

const towerDefenseData = {
    // AWS Service Towers
    towers: [
        {
            id: 'waf-tower',
            name: 'AWS WAF',
            emoji: '🛡️',
            description: 'Web Application Firewall filters malicious HTTP requests',
            cost: 50,
            damage: 15,
            range: 100,
            fireRate: 1000, // ms between shots
            targetType: 'web', // web, network, data
            effect: 'filter',
            awsInfo: 'WAF protects web apps by filtering traffic based on rules you define',
            quizCategory: 'security',
            unlockLevel: 1
        },
        {
            id: 'cloudfront-tower',
            name: 'CloudFront CDN',
            emoji: '🌐',
            description: 'Content Delivery Network deflects DDoS attacks',
            cost: 75,
            damage: 20,
            range: 150,
            fireRate: 800,
            targetType: 'network',
            effect: 'slow',
            awsInfo: 'CloudFront distributes content globally and absorbs DDoS attacks',
            quizCategory: 'networking',
            unlockLevel: 1
        },
        {
            id: 'shield-tower',
            name: 'AWS Shield',
            emoji: '🔰',
            description: 'DDoS protection service blocks volumetric attacks',
            cost: 100,
            damage: 30,
            range: 120,
            fireRate: 600,
            targetType: 'network',
            effect: 'stun',
            awsInfo: 'Shield provides always-on DDoS protection for your applications',
            quizCategory: 'security',
            unlockLevel: 3
        },
        {
            id: 'guardduty-tower',
            name: 'GuardDuty',
            emoji: '👁️',
            description: 'Threat detection finds malicious activity',
            cost: 125,
            damage: 25,
            range: 200,
            fireRate: 1200,
            targetType: 'data',
            effect: 'reveal',
            awsInfo: 'GuardDuty monitors for malicious activity using ML',
            quizCategory: 'security',
            unlockLevel: 5
        },
        {
            id: 'autoscaling-tower',
            name: 'Auto Scaling',
            emoji: '📈',
            description: 'Scales resources to handle traffic spikes',
            cost: 150,
            damage: 40,
            range: 100,
            fireRate: 500,
            targetType: 'network',
            effect: 'splash',
            awsInfo: 'Auto Scaling automatically adjusts capacity to maintain performance',
            quizCategory: 'ec2',
            unlockLevel: 7
        },
        {
            id: 'cloudwatch-tower',
            name: 'CloudWatch',
            emoji: '📊',
            description: 'Monitoring and alarming system',
            cost: 80,
            damage: 10,
            range: 250,
            fireRate: 2000,
            targetType: 'all',
            effect: 'boost',
            awsInfo: 'CloudWatch monitors resources and triggers alarms for issues',
            quizCategory: 'monitoring',
            unlockLevel: 2
        }
    ],

    // Enemy Types (Cloud Threats)
    enemies: [
        {
            id: 'ddos-swarm',
            name: 'DDoS Swarm',
            emoji: '🐝',
            health: 30,
            speed: 2.5,
            reward: 10,
            type: 'network',
            description: 'Fast volumetric attack overwhelming your bandwidth'
        },
        {
            id: 'sql-injection',
            name: 'SQL Injection',
            emoji: '💉',
            health: 50,
            speed: 1.5,
            reward: 15,
            type: 'web',
            description: 'Sneaky attack trying to access your database'
        },
        {
            id: 'data-breach',
            name: 'Data Breach Demon',
            emoji: '👿',
            health: 100,
            speed: 1.0,
            reward: 30,
            type: 'data',
            description: 'Slow but dangerous threat to steal sensitive data'
        },
        {
            id: 'cost-overrun',
            name: 'Cost Overrun',
            emoji: '💸',
            health: 40,
            speed: 2.0,
            reward: 20,
            type: 'network',
            description: 'Wastes your cloud budget with inefficient usage'
        },
        {
            id: 'malware',
            name: 'Malware Bot',
            emoji: '🦠',
            health: 60,
            speed: 1.8,
            reward: 25,
            type: 'data',
            description: 'Spreads infection across your infrastructure'
        },
        {
            id: 'downtime-dragon',
            name: 'Downtime Dragon',
            emoji: '🐉',
            health: 300,
            speed: 0.8,
            reward: 100,
            type: 'all',
            description: 'BOSS: Massive threat that causes service outages'
        }
    ],

    // Wave Configurations
    waves: [
        {
            wave: 1,
            name: 'First Attack',
            enemies: [
                { type: 'ddos-swarm', count: 5, spawnInterval: 1000 }
            ]
        },
        {
            wave: 2,
            name: 'Web Threats',
            enemies: [
                { type: 'ddos-swarm', count: 3, spawnInterval: 800 },
                { type: 'sql-injection', count: 2, spawnInterval: 1500 }
            ]
        },
        {
            wave: 3,
            name: 'Mixed Assault',
            enemies: [
                { type: 'ddos-swarm', count: 4, spawnInterval: 700 },
                { type: 'sql-injection', count: 3, spawnInterval: 1200 },
                { type: 'cost-overrun', count: 2, spawnInterval: 1500 }
            ]
        },
        {
            wave: 4,
            name: 'Data Threats',
            enemies: [
                { type: 'malware', count: 3, spawnInterval: 1000 },
                { type: 'data-breach', count: 2, spawnInterval: 2000 }
            ]
        },
        {
            wave: 5,
            name: 'BOSS: Downtime Dragon',
            enemies: [
                { type: 'ddos-swarm', count: 5, spawnInterval: 500 },
                { type: 'downtime-dragon', count: 1, spawnInterval: 3000 }
            ]
        },
        {
            wave: 6,
            name: 'Advanced Threats',
            enemies: [
                { type: 'ddos-swarm', count: 8, spawnInterval: 600 },
                { type: 'sql-injection', count: 4, spawnInterval: 1000 },
                { type: 'malware', count: 3, spawnInterval: 1500 }
            ]
        },
        {
            wave: 7,
            name: 'Heavy Assault',
            enemies: [
                { type: 'data-breach', count: 3, spawnInterval: 1500 },
                { type: 'cost-overrun', count: 4, spawnInterval: 1000 },
                { type: 'malware', count: 4, spawnInterval: 1200 }
            ]
        },
        {
            wave: 8,
            name: 'All-Out Attack',
            enemies: [
                { type: 'ddos-swarm', count: 10, spawnInterval: 500 },
                { type: 'sql-injection', count: 5, spawnInterval: 900 },
                { type: 'data-breach', count: 3, spawnInterval: 1800 },
                { type: 'malware', count: 4, spawnInterval: 1300 }
            ]
        },
        {
            wave: 9,
            name: 'BOSS RUSH',
            enemies: [
                { type: 'downtime-dragon', count: 2, spawnInterval: 5000 },
                { type: 'data-breach', count: 4, spawnInterval: 1500 }
            ]
        },
        {
            wave: 10,
            name: 'FINAL STAND',
            enemies: [
                { type: 'ddos-swarm', count: 15, spawnInterval: 400 },
                { type: 'sql-injection', count: 8, spawnInterval: 800 },
                { type: 'data-breach', count: 5, spawnInterval: 1500 },
                { type: 'malware', count: 6, spawnInterval: 1000 },
                { type: 'downtime-dragon', count: 1, spawnInterval: 10000 }
            ]
        }
    ],

    // Path waypoints (enemies follow this path)
    path: [
        { x: 50, y: 300 },
        { x: 150, y: 300 },
        { x: 150, y: 200 },
        { x: 300, y: 200 },
        { x: 300, y: 400 },
        { x: 450, y: 400 },
        { x: 450, y: 250 },
        { x: 600, y: 250 },
        { x: 600, y: 450 },
        { x: 750, y: 450 },
        { x: 750, y: 350 }
    ],

    // Build spots (where players can place towers)
    buildSpots: generateBuildSpots()
};

function generateBuildSpots() {
    const spots = [];
    const gridSize = 50;

    // Generate grid of potential build spots (not on path)
    for (let x = 100; x < 800; x += gridSize) {
        for (let y = 100; y < 600; y += gridSize) {
            // Check if spot is not too close to path
            let tooClose = false;
            for (const waypoint of towerDefenseData.path) {
                const dist = Math.sqrt(Math.pow(x - waypoint.x, 2) + Math.pow(y - waypoint.y, 2));
                if (dist < 30) {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose) {
                spots.push({ x, y, occupied: false });
            }
        }
    }

    return spots;
}

// Helper functions
function getTowerById(id) {
    return towerDefenseData.towers.find(t => t.id === id);
}

function getEnemyById(id) {
    return towerDefenseData.enemies.find(e => e.id === id);
}

function getWave(waveNumber) {
    return towerDefenseData.waves.find(w => w.wave === waveNumber);
}

function getUnlockedTowers(level) {
    return towerDefenseData.towers.filter(t => t.unlockLevel <= level);
}
