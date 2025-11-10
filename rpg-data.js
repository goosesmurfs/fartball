// AWS Cloud Farm - RPG System Data
// Character Stats, Skills, Equipment, Quests, and Boss Battles

const rpgData = {
    // Character Stats System
    characterStats: {
        // Primary Stats (improve with level)
        compute: 0,      // EC2, Lambda knowledge - affects damage
        storage: 0,      // S3, EBS knowledge - affects inventory size
        networking: 0,   // VPC, CloudFront - affects movement speed
        security: 0,     // IAM, Shield - affects defense
        database: 0,     // RDS, DynamoDB - affects mana/energy

        // Derived Stats
        maxHealth: 100,
        currentHealth: 100,
        maxMana: 50,
        currentMana: 50,
        attack: 10,
        defense: 5,
        critChance: 5,   // percentage

        // Resource stats
        inventorySlots: 10,
        movementSpeed: 1.0,
        experienceMultiplier: 1.0
    },

    // Skill Tree - Unlock abilities by answering quizzes correctly
    skillTree: {
        compute: {
            name: 'Compute Mastery',
            icon: '🖥️',
            skills: [
                {
                    id: 'ec2-launch',
                    name: 'EC2 Launch',
                    description: 'Summon a virtual machine to fight by your side',
                    level: 1,
                    cost: 1,
                    unlocked: false,
                    effect: { attack: 5, summonDuration: 30 }
                },
                {
                    id: 'auto-scaling',
                    name: 'Auto Scaling',
                    description: 'Multiply your attack power temporarily',
                    level: 3,
                    cost: 2,
                    unlocked: false,
                    effect: { attackMultiplier: 2, duration: 15 }
                },
                {
                    id: 'lambda-burst',
                    name: 'Lambda Burst',
                    description: 'Instant powerful attack with no cooldown',
                    level: 5,
                    cost: 3,
                    unlocked: false,
                    effect: { damage: 50, manaCost: 20 }
                }
            ]
        },
        storage: {
            name: 'Storage Mastery',
            icon: '📦',
            skills: [
                {
                    id: 's3-backup',
                    name: 'S3 Backup',
                    description: 'Create a restore point to recover health',
                    level: 1,
                    cost: 1,
                    unlocked: false,
                    effect: { healthRestore: 30 }
                },
                {
                    id: 'glacier-freeze',
                    name: 'Glacier Freeze',
                    description: 'Freeze enemies in place',
                    level: 3,
                    cost: 2,
                    unlocked: false,
                    effect: { freezeDuration: 10 }
                },
                {
                    id: 'ebs-shield',
                    name: 'EBS Shield',
                    description: 'Create a persistent shield that blocks damage',
                    level: 5,
                    cost: 3,
                    unlocked: false,
                    effect: { shield: 50, duration: 20 }
                }
            ]
        },
        networking: {
            name: 'Network Mastery',
            icon: '🌐',
            skills: [
                {
                    id: 'cloudfront-dash',
                    name: 'CloudFront Dash',
                    description: 'Teleport short distances instantly',
                    level: 1,
                    cost: 1,
                    unlocked: false,
                    effect: { dashDistance: 5, cooldown: 3 }
                },
                {
                    id: 'vpc-barrier',
                    name: 'VPC Barrier',
                    description: 'Create an impassable wall',
                    level: 3,
                    cost: 2,
                    unlocked: false,
                    effect: { barrierDuration: 15 }
                },
                {
                    id: 'route53-warp',
                    name: 'Route 53 Warp',
                    description: 'Teleport to any discovered location',
                    level: 5,
                    cost: 3,
                    unlocked: false,
                    effect: { teleport: true }
                }
            ]
        },
        security: {
            name: 'Security Mastery',
            icon: '🛡️',
            skills: [
                {
                    id: 'iam-armor',
                    name: 'IAM Armor',
                    description: 'Increase defense based on correct answers',
                    level: 1,
                    cost: 1,
                    unlocked: false,
                    effect: { defenseBonus: 10 }
                },
                {
                    id: 'waf-reflect',
                    name: 'WAF Reflect',
                    description: 'Reflect enemy attacks back at them',
                    level: 3,
                    cost: 2,
                    unlocked: false,
                    effect: { reflectPercent: 50, duration: 10 }
                },
                {
                    id: 'shield-advanced',
                    name: 'Shield Advanced',
                    description: 'Become invulnerable for a short time',
                    level: 5,
                    cost: 3,
                    unlocked: false,
                    effect: { invulnerable: true, duration: 5 }
                }
            ]
        },
        database: {
            name: 'Database Mastery',
            icon: '🗄️',
            skills: [
                {
                    id: 'rds-restore',
                    name: 'RDS Restore',
                    description: 'Restore health from database backups',
                    level: 1,
                    cost: 1,
                    unlocked: false,
                    effect: { healOverTime: 5, duration: 10 }
                },
                {
                    id: 'dynamodb-speed',
                    name: 'DynamoDB Speed',
                    description: 'Dramatically increase action speed',
                    level: 3,
                    cost: 2,
                    unlocked: false,
                    effect: { speedMultiplier: 2, duration: 15 }
                },
                {
                    id: 'elasticache-boost',
                    name: 'ElastiCache Boost',
                    description: 'Reduce all cooldowns instantly',
                    level: 5,
                    cost: 3,
                    unlocked: false,
                    effect: { cooldownReset: true }
                }
            ]
        }
    },

    // Equipment System - Earn from quizzes and achievements
    equipment: {
        weapons: [
            {
                id: 'wooden-cursor',
                name: 'Wooden Cursor',
                emoji: '🪵',
                rarity: 'common',
                stats: { attack: 5 },
                requiredLevel: 1,
                description: 'A basic pointing device for cloud management'
            },
            {
                id: 'ec2-hammer',
                name: 'EC2 Instance Hammer',
                emoji: '🔨',
                rarity: 'uncommon',
                stats: { attack: 15, compute: 2 },
                requiredLevel: 3,
                description: 'Forged from pure compute power'
            },
            {
                id: 'lambda-staff',
                name: 'Lambda Function Staff',
                emoji: '🪄',
                rarity: 'rare',
                stats: { attack: 25, compute: 5, critChance: 10 },
                requiredLevel: 7,
                description: 'Channels serverless energy'
            },
            {
                id: 'cloudfront-blade',
                name: 'CloudFront Edge Blade',
                emoji: '⚔️',
                rarity: 'epic',
                stats: { attack: 40, networking: 5, movementSpeed: 1.3 },
                requiredLevel: 12,
                description: 'Strikes at the speed of global CDN delivery'
            },
            {
                id: 'architect-scepter',
                name: 'Cloud Architect\'s Scepter',
                emoji: '👑',
                rarity: 'legendary',
                stats: { attack: 60, compute: 10, networking: 10, critChance: 25 },
                requiredLevel: 20,
                description: 'Ultimate power of AWS mastery'
            }
        ],
        armor: [
            {
                id: 'cloth-hoodie',
                name: 'Developer Hoodie',
                emoji: '👕',
                rarity: 'common',
                stats: { defense: 5 },
                requiredLevel: 1,
                description: 'Comfortable attire for long coding sessions'
            },
            {
                id: 'iam-vest',
                name: 'IAM Security Vest',
                emoji: '🦺',
                rarity: 'uncommon',
                stats: { defense: 15, security: 3 },
                requiredLevel: 4,
                description: 'Protected by principle of least privilege'
            },
            {
                id: 'vpc-armor',
                name: 'VPC Network Armor',
                emoji: '🛡️',
                rarity: 'rare',
                stats: { defense: 30, security: 6, networking: 3 },
                requiredLevel: 8,
                description: 'Isolated and secure like a private cloud'
            },
            {
                id: 'shield-advanced',
                name: 'AWS Shield Advanced Plate',
                emoji: '💠',
                rarity: 'epic',
                stats: { defense: 50, security: 10, maxHealth: 50 },
                requiredLevel: 14,
                description: 'DDoS protection at its finest'
            },
            {
                id: 'well-architected',
                name: 'Well-Architected Framework Robes',
                emoji: '✨',
                rarity: 'legendary',
                stats: { defense: 80, security: 15, maxHealth: 100, allStats: 5 },
                requiredLevel: 20,
                description: 'Embodies all six pillars of excellence'
            }
        ],
        accessories: [
            {
                id: 'cloud-badge',
                name: 'Cloud Practitioner Badge',
                emoji: '🏅',
                rarity: 'common',
                stats: { experienceMultiplier: 1.1 },
                requiredLevel: 1,
                description: 'Proof of your cloud journey'
            },
            {
                id: 's3-ring',
                name: 'S3 Storage Ring',
                emoji: '💍',
                rarity: 'uncommon',
                stats: { storage: 5, inventorySlots: 5 },
                requiredLevel: 5,
                description: 'Holds unlimited items (well, almost)'
            },
            {
                id: 'cloudwatch-amulet',
                name: 'CloudWatch Amulet',
                emoji: '📿',
                rarity: 'rare',
                stats: { maxMana: 30, database: 5 },
                requiredLevel: 10,
                description: 'See all metrics, predict all failures'
            },
            {
                id: 'cost-optimizer',
                name: 'Cost Optimization Pendant',
                emoji: '💎',
                rarity: 'epic',
                stats: { experienceMultiplier: 1.5, creditMultiplier: 1.5 },
                requiredLevel: 15,
                description: 'Everything is cheaper with this equipped'
            }
        ]
    },

    // Quest System - Story-driven learning objectives
    quests: [
        {
            id: 'first-steps',
            name: 'First Steps in the Cloud',
            description: 'Complete your first quiz to prove you\'re ready for the cloud journey',
            type: 'main',
            objectives: [
                { type: 'quiz', target: 1, current: 0, description: 'Complete 1 quiz' }
            ],
            rewards: {
                xp: 100,
                credits: 50,
                equipment: 'wooden-cursor',
                skillPoint: 1
            },
            requiredLevel: 1,
            completed: false
        },
        {
            id: 'compute-basics',
            name: 'Understanding Compute',
            description: 'Master EC2 and Lambda to unlock compute powers',
            type: 'main',
            objectives: [
                { type: 'quiz-category', category: 'ec2', target: 3, current: 0, description: 'Pass 3 EC2 quizzes' },
                { type: 'quiz-category', category: 'lambda', target: 2, current: 0, description: 'Pass 2 Lambda quizzes' }
            ],
            rewards: {
                xp: 300,
                credits: 200,
                equipment: 'ec2-hammer',
                skillPoint: 2,
                statBonus: { compute: 5 }
            },
            requiredLevel: 3,
            completed: false
        },
        {
            id: 'storage-master',
            name: 'Storage Solutions Expert',
            description: 'Learn all storage services to expand your capabilities',
            type: 'main',
            objectives: [
                { type: 'quiz-category', category: 'storage', target: 5, current: 0, description: 'Pass 5 Storage quizzes with 80%+' },
                { type: 'plant-service', service: 's3-storage', target: 3, current: 0, description: 'Plant 3 S3 Storage services' }
            ],
            rewards: {
                xp: 500,
                credits: 300,
                equipment: 's3-ring',
                skillPoint: 3,
                statBonus: { storage: 10 }
            },
            requiredLevel: 5,
            completed: false
        },
        {
            id: 'network-ninja',
            name: 'Networking Ninja',
            description: 'Master VPC, CloudFront, and Route 53',
            type: 'side',
            objectives: [
                { type: 'quiz-category', category: 'networking', target: 5, current: 0, description: 'Ace 5 Networking quizzes' },
                { type: 'perfect-score', target: 2, current: 0, description: 'Get 2 perfect scores on networking' }
            ],
            rewards: {
                xp: 600,
                credits: 400,
                equipment: 'cloudfront-blade',
                skillPoint: 3,
                statBonus: { networking: 10 }
            },
            requiredLevel: 8,
            completed: false
        },
        {
            id: 'security-sentinel',
            name: 'Become a Security Sentinel',
            description: 'Protect the cloud with IAM, Shield, and WAF knowledge',
            type: 'main',
            objectives: [
                { type: 'quiz-category', category: 'security', target: 7, current: 0, description: 'Master 7 Security quizzes' },
                { type: 'talk-npc', npc: 'iam-sentinel', target: 5, current: 0, description: 'Learn from IAM Sentinel 5 times' }
            ],
            rewards: {
                xp: 800,
                credits: 500,
                equipment: 'shield-advanced',
                skillPoint: 4,
                statBonus: { security: 15 }
            },
            requiredLevel: 10,
            completed: false
        },
        {
            id: 'database-deity',
            name: 'Database Deity',
            description: 'Master all database services',
            type: 'main',
            objectives: [
                { type: 'quiz-category', category: 'database', target: 6, current: 0, description: 'Conquer 6 Database quizzes' },
                { type: 'quiz-streak', target: 5, current: 0, description: 'Maintain a 5-quiz win streak' }
            ],
            rewards: {
                xp: 1000,
                credits: 600,
                equipment: 'cloudwatch-amulet',
                skillPoint: 5,
                statBonus: { database: 15 }
            },
            requiredLevel: 12,
            completed: false
        },
        {
            id: 'cloud-architect',
            name: 'Become a Cloud Architect',
            description: 'The ultimate challenge - master everything',
            type: 'legendary',
            objectives: [
                { type: 'level', target: 20, current: 1, description: 'Reach level 20' },
                { type: 'quiz-total', target: 50, current: 0, description: 'Complete 50 total quizzes' },
                { type: 'perfect-score', target: 10, current: 0, description: 'Get 10 perfect scores' },
                { type: 'all-services', target: 7, current: 0, description: 'Plant all service types' }
            ],
            rewards: {
                xp: 5000,
                credits: 5000,
                equipment: ['architect-scepter', 'well-architected', 'cost-optimizer'],
                skillPoint: 10,
                statBonus: { compute: 20, storage: 20, networking: 20, security: 20, database: 20 },
                title: 'AWS Cloud Architect'
            },
            requiredLevel: 15,
            completed: false
        }
    ],

    // Boss Battles - Challenge encounters that test AWS knowledge
    bosses: [
        {
            id: 'bug-swarm',
            name: 'Bug Swarm',
            emoji: '🐛',
            level: 3,
            health: 200,
            attack: 15,
            defense: 5,
            xpReward: 500,
            creditReward: 300,
            description: 'A swarm of bugs attacking your infrastructure',
            quizCategory: 'ec2',
            quizQuestions: 3,
            difficulty: 'easy',
            abilities: ['multiply', 'scatter-attack'],
            dropTable: ['ec2-hammer', 'cloud-badge']
        },
        {
            id: 'data-breach',
            name: 'Data Breach Demon',
            emoji: '👿',
            level: 7,
            health: 500,
            attack: 30,
            defense: 15,
            xpReward: 1000,
            creditReward: 600,
            description: 'A malicious entity trying to steal your data',
            quizCategory: 'security',
            quizQuestions: 5,
            difficulty: 'medium',
            abilities: ['steal-credentials', 'ddos-blast', 'phishing-net'],
            dropTable: ['iam-vest', 'vpc-armor', 's3-ring']
        },
        {
            id: 'cost-monster',
            name: 'Cost Overrun Monster',
            emoji: '💸',
            level: 10,
            health: 800,
            attack: 40,
            defense: 20,
            xpReward: 1500,
            creditReward: 800,
            description: 'Unoptimized resources draining your budget',
            quizCategory: 'pricing',
            quizQuestions: 7,
            difficulty: 'medium',
            abilities: ['bill-shock', 'instance-bloat', 'waste-resources'],
            dropTable: ['cost-optimizer', 'cloudwatch-amulet']
        },
        {
            id: 'downtime-dragon',
            name: 'Downtime Dragon',
            emoji: '🐉',
            level: 15,
            health: 1500,
            attack: 60,
            defense: 30,
            xpReward: 3000,
            creditReward: 1500,
            description: 'Causes catastrophic service outages',
            quizCategory: 'networking',
            quizQuestions: 10,
            difficulty: 'hard',
            abilities: ['service-outage', 'latency-spike', 'packet-loss', 'region-failure'],
            dropTable: ['cloudfront-blade', 'shield-advanced', 'vpc-armor']
        },
        {
            id: 'chaos-architect',
            name: 'Chaos Architect',
            emoji: '🌪️',
            level: 20,
            health: 3000,
            attack: 100,
            defense: 50,
            xpReward: 10000,
            creditReward: 5000,
            description: 'The ultimate test of your AWS knowledge',
            quizCategory: 'mixed',
            quizQuestions: 15,
            difficulty: 'legendary',
            abilities: ['random-chaos', 'compliance-violation', 'architecture-breakdown', 'disaster-scenario'],
            dropTable: ['architect-scepter', 'well-architected', 'cost-optimizer'],
            isFinalBoss: true
        }
    ],

    // Experience curve - XP needed per level
    experienceCurve: [
        0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
        4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000,
        26000, 30000
    ],

    // Level up rewards
    levelRewards: {
        2: { skillPoint: 1, credits: 100 },
        3: { skillPoint: 1, credits: 150, unlockNPC: 'lambda-wizard' },
        4: { skillPoint: 1, credits: 200, unlockNPC: 'rds-guardian' },
        5: { skillPoint: 2, credits: 300, statBonus: { compute: 2, storage: 2 } },
        7: { skillPoint: 1, credits: 400, unlockBoss: 'data-breach' },
        8: { skillPoint: 1, credits: 500, unlockNPC: 'vpc-architect' },
        10: { skillPoint: 2, credits: 700, statBonus: { networking: 3, security: 3 }, unlockBoss: 'cost-monster' },
        12: { skillPoint: 1, credits: 900 },
        15: { skillPoint: 2, credits: 1500, statBonus: { database: 5 }, unlockBoss: 'downtime-dragon' },
        20: { skillPoint: 5, credits: 5000, statBonus: { compute: 10, storage: 10, networking: 10, security: 10, database: 10 }, unlockBoss: 'chaos-architect', title: 'Cloud Master' }
    }
};

// Helper functions for RPG system
function getEquipmentById(id) {
    const allEquipment = [
        ...rpgData.equipment.weapons,
        ...rpgData.equipment.armor,
        ...rpgData.equipment.accessories
    ];
    return allEquipment.find(item => item.id === id);
}

function getQuestById(id) {
    return rpgData.quests.find(quest => quest.id === id);
}

function getBossById(id) {
    return rpgData.bosses.find(boss => boss.id === id);
}

function getSkillById(domain, skillId) {
    if (!rpgData.skillTree[domain]) return null;
    return rpgData.skillTree[domain].skills.find(skill => skill.id === skillId);
}

function getXPForLevel(level) {
    return rpgData.experienceCurve[level] || rpgData.experienceCurve[rpgData.experienceCurve.length - 1];
}

function getLevelRewards(level) {
    return rpgData.levelRewards[level] || null;
}

function calculateStats(baseStats, equipment, skills) {
    const stats = { ...baseStats };

    // Add equipment bonuses
    equipment.forEach(item => {
        if (item && item.stats) {
            Object.keys(item.stats).forEach(stat => {
                stats[stat] = (stats[stat] || 0) + item.stats[stat];
            });
        }
    });

    // Add skill bonuses
    skills.forEach(skill => {
        if (skill && skill.unlocked && skill.effect) {
            Object.keys(skill.effect).forEach(stat => {
                if (typeof skill.effect[stat] === 'number') {
                    stats[stat] = (stats[stat] || 0) + skill.effect[stat];
                }
            });
        }
    });

    return stats;
}

function getRarityColor(rarity) {
    const colors = {
        common: '#9e9e9e',
        uncommon: '#4caf50',
        rare: '#2196f3',
        epic: '#9c27b0',
        legendary: '#ff9800'
    };
    return colors[rarity] || colors.common;
}
