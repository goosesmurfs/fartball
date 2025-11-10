// AWS Cloud Farm - Game Data
// NPCs, Services, Items, and Achievements

const gameData = {
    npcs: [
        {
            id: 'ec2-elder',
            name: 'EC2 Elder',
            emoji: '🖥️',
            position: { x: 5, y: 5 },
            dialogs: [
                "Welcome to AWS Cloud Farm! I'm the EC2 Elder. I teach about virtual servers in the cloud.",
                "EC2 instances are like tractors - you can scale up (bigger tractor) or scale out (more tractors)!",
                "Remember: Choose the right instance type for your workload. It's like choosing the right tool for the job!",
                "Want to test your EC2 knowledge? Talk to me anytime for a quiz!"
            ],
            quizCategory: 'ec2',
            unlocked: true
        },
        {
            id: 's3-sage',
            name: 'S3 Sage',
            emoji: '📦',
            position: { x: 15, y: 5 },
            dialogs: [
                "Greetings! I am the S3 Sage, keeper of infinite storage wisdom.",
                "S3 is like a magical warehouse - it can store unlimited objects, each up to 5TB!",
                "Different storage classes are like different barns - some for frequent access, some for archives.",
                "Master S3 storage classes and you'll optimize costs like a true cloud farmer!"
            ],
            quizCategory: 'storage',
            unlocked: true
        },
        {
            id: 'lambda-wizard',
            name: 'Lambda Wizard',
            emoji: '⚡',
            position: { x: 10, y: 8 },
            dialogs: [
                "Ah, a young cloud farmer! I am the Lambda Wizard - master of serverless magic!",
                "With Lambda, you don't need to manage servers. Your code just runs when needed!",
                "It's like having magical helpers that appear only when you call them and disappear when done.",
                "Pay only for what you use - now that's real cloud magic!"
            ],
            quizCategory: 'lambda',
            unlocked: false,
            unlockLevel: 3
        },
        {
            id: 'rds-guardian',
            name: 'RDS Guardian',
            emoji: '🗄️',
            position: { x: 20, y: 8 },
            dialogs: [
                "I protect the sacred databases of the cloud! I am the RDS Guardian.",
                "Relational databases store structured data, like organized filing cabinets.",
                "RDS manages backups, patches, and scaling for you - no manual labor needed!",
                "Multi-AZ deployments are like having backup generators for your farm."
            ],
            quizCategory: 'database',
            unlocked: false,
            unlockLevel: 2
        },
        {
            id: 'vpc-architect',
            name: 'VPC Architect',
            emoji: '🏗️',
            position: { x: 8, y: 15 },
            dialogs: [
                "Welcome to the networking zone! I design virtual private clouds.",
                "A VPC is like fencing your farm - it isolates and protects your resources.",
                "Subnets divide your VPC like different fields in your farm.",
                "Security groups and NACLs are your gates and guards!"
            ],
            quizCategory: 'networking',
            unlocked: false,
            unlockLevel: 4
        },
        {
            id: 'iam-sentinel',
            name: 'IAM Sentinel',
            emoji: '🛡️',
            position: { x: 12, y: 15 },
            dialogs: [
                "Security is paramount! I am the IAM Sentinel, guardian of access control.",
                "IAM is about giving the right permissions to the right entities - principle of least privilege!",
                "Users, groups, roles, and policies work together like a security team.",
                "Enable MFA on your root account - it's like having a double lock on your barn!"
            ],
            quizCategory: 'security',
            unlocked: false,
            unlockLevel: 3
        },
        {
            id: 'cloudwatch-oracle',
            name: 'CloudWatch Oracle',
            emoji: '👁️',
            position: { x: 18, y: 12 },
            dialogs: [
                "I see all that happens in your cloud... I am the CloudWatch Oracle!",
                "Monitoring is like checking your crops daily - catch problems early!",
                "Metrics, logs, and alarms help you understand your infrastructure's health.",
                "Set up alarms to be notified before small problems become big disasters!"
            ],
            quizCategory: 'monitoring',
            unlocked: false,
            unlockLevel: 5
        },
        {
            id: 'billing-merchant',
            name: 'Billing Merchant',
            emoji: '💰',
            position: { x: 25, y: 10 },
            dialogs: [
                "Let's talk cloud credits! I'm the Billing Merchant.",
                "Understanding AWS pricing helps you optimize costs - more savings, bigger farm!",
                "Use Reserved Instances for steady workloads, Spot for flexible ones.",
                "The Pricing Calculator and Cost Explorer are your best friends for budgeting!"
            ],
            quizCategory: 'pricing',
            unlocked: true
        }
    ],

    services: [
        {
            id: 'ec2-farm',
            name: 'EC2 Compute Farm',
            emoji: '🖥️',
            description: 'Plant virtual servers that grow compute power',
            cost: 10,
            xpReward: 20,
            category: 'compute',
            unlocked: true
        },
        {
            id: 's3-storage',
            name: 'S3 Storage Barn',
            emoji: '📦',
            description: 'Store unlimited objects in the cloud',
            cost: 15,
            xpReward: 25,
            category: 'storage',
            unlocked: true
        },
        {
            id: 'lambda-function',
            name: 'Lambda Function Garden',
            emoji: '⚡',
            description: 'Grow serverless functions that run on demand',
            cost: 20,
            xpReward: 30,
            category: 'compute',
            unlocked: false,
            unlockLevel: 2
        },
        {
            id: 'rds-database',
            name: 'RDS Database Pond',
            emoji: '🗄️',
            description: 'Cultivate managed relational databases',
            cost: 25,
            xpReward: 35,
            category: 'database',
            unlocked: false,
            unlockLevel: 3
        },
        {
            id: 'dynamodb-table',
            name: 'DynamoDB NoSQL Grove',
            emoji: '📊',
            description: 'Fast, flexible NoSQL database tables',
            cost: 30,
            xpReward: 40,
            category: 'database',
            unlocked: false,
            unlockLevel: 3
        },
        {
            id: 'vpc-network',
            name: 'VPC Network Fence',
            emoji: '🏗️',
            description: 'Build isolated network infrastructure',
            cost: 35,
            xpReward: 45,
            category: 'networking',
            unlocked: false,
            unlockLevel: 4
        },
        {
            id: 'cloudfront-cdn',
            name: 'CloudFront Distribution',
            emoji: '🌐',
            description: 'Deliver content globally with low latency',
            cost: 40,
            xpReward: 50,
            category: 'networking',
            unlocked: false,
            unlockLevel: 5
        }
    ],

    achievements: [
        {
            id: 'first-quiz',
            name: 'First Steps',
            description: 'Complete your first quiz',
            emoji: '🎓',
            unlocked: false
        },
        {
            id: 'ec2-master',
            name: 'EC2 Master',
            description: 'Score 100% on an EC2 quiz',
            emoji: '🖥️',
            unlocked: false
        },
        {
            id: 's3-expert',
            name: 'S3 Expert',
            description: 'Score 100% on a Storage quiz',
            emoji: '📦',
            unlocked: false
        },
        {
            id: 'quiz-streak',
            name: 'Quiz Streak',
            description: 'Complete 5 quizzes in a row',
            emoji: '🔥',
            unlocked: false
        },
        {
            id: 'level-5',
            name: 'Cloud Practitioner',
            description: 'Reach level 5',
            emoji: '☁️',
            unlocked: false
        },
        {
            id: 'level-10',
            name: 'Cloud Architect',
            description: 'Reach level 10',
            emoji: '🏗️',
            unlocked: false
        },
        {
            id: 'perfect-score',
            name: 'Perfectionist',
            description: 'Get a perfect score on a 10-question quiz',
            emoji: '💯',
            unlocked: false
        },
        {
            id: 'all-services',
            name: 'Service Collector',
            description: 'Plant all available AWS services',
            emoji: '🌟',
            unlocked: false
        },
        {
            id: 'rich-farmer',
            name: 'Cloud Millionaire',
            description: 'Accumulate 1000 cloud credits',
            emoji: '💎',
            unlocked: false
        },
        {
            id: 'security-expert',
            name: 'Security Expert',
            description: 'Score 100% on a Security quiz',
            emoji: '🛡️',
            unlocked: false
        }
    ],

    dailyTasks: [
        {
            id: 'daily-quiz',
            description: 'Complete 3 quizzes',
            target: 3,
            reward: 50,
            category: 'quiz'
        },
        {
            id: 'talk-to-npcs',
            description: 'Talk to 2 different NPCs',
            target: 2,
            reward: 30,
            category: 'social'
        },
        {
            id: 'plant-services',
            description: 'Plant 1 AWS service',
            target: 1,
            reward: 40,
            category: 'farming'
        }
    ],

    tips: [
        "💡 The AWS Free Tier includes 750 hours of EC2 t2.micro instances per month!",
        "💡 S3 buckets must have globally unique names across all AWS accounts.",
        "💡 Security Groups are stateful - if you allow inbound traffic, outbound is automatically allowed.",
        "💡 Use IAM roles instead of embedding credentials in your code!",
        "💡 Reserved Instances can save you up to 75% compared to On-Demand pricing.",
        "💡 Lambda functions are billed per request and duration - no idle costs!",
        "💡 CloudWatch Logs can store your application logs for analysis.",
        "💡 Use tags to organize and track costs across your AWS resources.",
        "💡 Multi-AZ deployments increase availability but cost more than single-AZ.",
        "💡 The AWS Well-Architected Framework has 6 pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability."
    ],

    mapLayout: {
        width: 30,
        height: 20,
        tileSize: 32,
        layers: {
            ground: 'grass',
            decorations: ['trees', 'rocks', 'flowers'],
            zones: [
                { name: 'Compute Zone', x: 0, y: 0, width: 10, height: 10, color: '#3498db' },
                { name: 'Storage Zone', x: 10, y: 0, width: 10, height: 10, color: '#2ecc71' },
                { name: 'Database Zone', x: 20, y: 0, width: 10, height: 10, color: '#e74c3c' },
                { name: 'Network Zone', x: 0, y: 10, width: 15, height: 10, color: '#f39c12' },
                { name: 'Security Zone', x: 15, y: 10, width: 15, height: 10, color: '#9b59b6' }
            ]
        }
    }
};

// Helper functions
function getNPCById(id) {
    return gameData.npcs.find(npc => npc.id === id);
}

function getServiceById(id) {
    return gameData.services.find(service => service.id === id);
}

function getAchievementById(id) {
    return gameData.achievements.find(achievement => achievement.id === id);
}

function getUnlockedNPCs(level) {
    return gameData.npcs.filter(npc => npc.unlocked || (npc.unlockLevel && level >= npc.unlockLevel));
}

function getUnlockedServices(level) {
    return gameData.services.filter(service => service.unlocked || (service.unlockLevel && level >= service.unlockLevel));
}

function getRandomTip() {
    return gameData.tips[Math.floor(Math.random() * gameData.tips.length)];
}
