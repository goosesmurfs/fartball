# ☁️ AWS Cloud Farm

> A Stardew Valley-inspired training game for the AWS Certified Cloud Practitioner (CCP) Exam

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![AWS](https://img.shields.io/badge/AWS-CCP-orange)

## 🎮 About

**AWS Cloud Farm** is an interactive browser game that makes studying for the AWS Certified Cloud Practitioner exam fun and engaging! Inspired by the beloved farming game Stardew Valley, you'll manage your own cloud infrastructure farm while learning AWS services and concepts.

## ✨ Features

### 🎓 Comprehensive AWS CCP Coverage
- **100+ Quiz Questions** covering all exam domains:
  - Cloud Concepts
  - AWS Core Services (EC2, S3, RDS, Lambda, etc.)
  - Security & Compliance
  - Billing & Pricing
  - Networking
  - Database Services
  - Monitoring & Management

### 🎮 Engaging Gameplay
- **Stardew Valley-style** pixel art aesthetics
- **8 Unique NPCs** representing AWS service categories
- **Progressive unlocking** of content as you level up
- **Daily tasks** to keep you learning consistently
- **Achievement system** to track your progress
- **Service planting** mechanic to visualize your AWS knowledge growth

### 📊 Learning Features
- Detailed explanations for every quiz answer
- Topic-specific quizzes for focused learning
- Mixed quizzes for comprehensive review
- Progress tracking and statistics
- Spaced repetition through daily tasks
- Visual zone-based learning (Compute, Storage, Database, Networking, Security)

## 🚀 Getting Started

### Installation

1. **Clone or download** this repository
2. **Open `index.html`** in a modern web browser (Chrome, Firefox, Safari, Edge)
3. **Start playing!** No installation or build process required

```bash
# Clone the repository
git clone <repository-url>
cd aws-cloud-farm

# Open in browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Deployment

To deploy online, simply upload all files to any static web hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront (practice what you learn!)

## 🎯 How to Play

### Controls
- **Arrow Keys** or **WASD**: Move your character
- **SPACE**: Interact with NPCs
- **E**: Open the AWS Service Shop

### Game Loop
1. **Move around** the cloud farm and explore different zones
2. **Talk to NPCs** to learn about AWS services
3. **Take quizzes** to earn Cloud Credits (☁️) and XP (⭐)
4. **Level up** to unlock new services and zones
5. **Plant AWS services** to build your cloud infrastructure
6. **Complete daily tasks** for bonus rewards
7. **Unlock achievements** as you master topics

### Zones
- **Compute Zone** (Blue): EC2, Lambda, Auto Scaling
- **Storage Zone** (Green): S3, EBS, EFS
- **Database Zone** (Red): RDS, DynamoDB, ElastiCache
- **Network Zone** (Orange): VPC, CloudFront, Route 53
- **Security Zone** (Purple): IAM, WAF, Shield, Inspector

### Progression System

#### Levels & XP
- Complete quizzes to earn XP
- Level up to unlock new NPCs, services, and zones
- Each level requires more XP than the last

#### Cloud Credits
- Earn credits by passing quizzes (70% or higher)
- Spend credits to plant AWS services
- Complete daily tasks for bonus credits

#### Achievements
Unlock special achievements by:
- Completing your first quiz
- Getting perfect scores on category quizzes
- Reaching level milestones
- Planting all services
- Building quiz streaks

## 📚 AWS CCP Exam Domains Covered

### 1. Cloud Concepts (26% of exam)
- Benefits of AWS Cloud
- Cloud computing models
- Cloud deployment models
- Elasticity and scalability
- Well-Architected Framework

### 2. Security & Compliance (25% of exam)
- Shared Responsibility Model
- IAM (Users, Groups, Roles, Policies)
- Security services (WAF, Shield, Inspector, GuardDuty)
- Compliance programs

### 3. Technology (33% of exam)
- **Compute**: EC2, Lambda, ECS
- **Storage**: S3, EBS, EFS, Glacier
- **Database**: RDS, DynamoDB, Redshift
- **Networking**: VPC, CloudFront, Route 53
- **Monitoring**: CloudWatch, CloudTrail

### 4. Billing & Pricing (16% of exam)
- Pricing models
- Cost management tools
- Support plans
- AWS Free Tier

## 🎓 Study Tips

### For Beginners
1. **Start with Cloud Concepts**: Talk to the EC2 Elder and Billing Merchant first
2. **Take category-specific quizzes**: Focus on one domain at a time
3. **Read the explanations**: Every question includes detailed explanations
4. **Complete daily tasks**: Build a consistent study habit

### For Intermediate Learners
1. **Take mixed quizzes**: Test your knowledge across all domains
2. **Aim for perfect scores**: Master each category
3. **Unlock all NPCs**: Each teaches unique AWS concepts
4. **Plant all services**: Visualize the full AWS ecosystem

### For Advanced Learners
1. **Maintain quiz streaks**: Test your retention over time
2. **Achieve 100% on 10-question quizzes**: Simulate exam conditions
3. **Review missed questions**: Learn from mistakes
4. **Teach others**: Share your strategies

## 🏆 Achievement Guide

| Achievement | Requirement | Reward |
|-------------|-------------|---------|
| 🎓 First Steps | Complete your first quiz | Foundation laid |
| 🖥️ EC2 Master | Perfect score on EC2 quiz | Compute mastery |
| 📦 S3 Expert | Perfect score on Storage quiz | Storage mastery |
| 🛡️ Security Expert | Perfect score on Security quiz | Security mastery |
| 🔥 Quiz Streak | Complete 5 quizzes in a row | Consistency |
| ☁️ Cloud Practitioner | Reach level 5 | Mid-game milestone |
| 🏗️ Cloud Architect | Reach level 10 | Expert level |
| 💯 Perfectionist | Perfect score on 10-question quiz | Excellence |
| 🌟 Service Collector | Plant all AWS services | Complete knowledge |
| 💎 Cloud Millionaire | Accumulate 1000 credits | Resource master |

## 📖 AWS Service Reference

### NPCs & Their Domains

#### 🖥️ EC2 Elder (Available from start)
**Topics**: EC2 instances, pricing models, security groups, AMIs, Auto Scaling

#### 📦 S3 Sage (Available from start)
**Topics**: Object storage, storage classes, buckets, versioning, lifecycle policies

#### ⚡ Lambda Wizard (Unlocks at Level 3)
**Topics**: Serverless computing, event-driven architecture, pricing, triggers

#### 🗄️ RDS Guardian (Unlocks at Level 2)
**Topics**: Relational databases, Multi-AZ, read replicas, backup & restore

#### 🏗️ VPC Architect (Unlocks at Level 4)
**Topics**: Virtual networks, subnets, route tables, internet gateways, NAT

#### 🛡️ IAM Sentinel (Unlocks at Level 3)
**Topics**: Users, groups, roles, policies, MFA, least privilege

#### 👁️ CloudWatch Oracle (Unlocks at Level 5)
**Topics**: Monitoring, metrics, logs, alarms, dashboards

#### 💰 Billing Merchant (Available from start)
**Topics**: Pricing models, Cost Explorer, Budgets, Free Tier, Savings Plans

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Structure and canvas for game rendering
- **CSS3**: Styling with gradients, animations, and flexbox
- **Vanilla JavaScript**: Game engine and logic (no frameworks!)
- **LocalStorage**: Save game persistence

### File Structure
```
aws-cloud-farm/
├── index.html          # Main game page
├── styles.css          # All styling and animations
├── game.js             # Core game engine
├── game-data.js        # NPCs, services, achievements
├── quiz-data.js        # 100+ AWS CCP quiz questions
└── README.md           # This file
```

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance
- Lightweight: ~150KB total
- No external dependencies
- 60 FPS smooth animations
- Works offline after first load

## 🎯 Real AWS CCP Exam Preparation

### This Game Covers:
- ✅ Key AWS services and their use cases
- ✅ Core cloud computing concepts
- ✅ Security best practices
- ✅ Pricing and billing fundamentals
- ✅ Architectural principles

### Additional Study Resources:
1. **AWS Official Training**: [AWS Skill Builder](https://skillbuilder.aws)
2. **AWS Documentation**: [AWS Docs](https://docs.aws.amazon.com)
3. **Practice Exams**: AWS Official Practice Exams
4. **Hands-on**: AWS Free Tier for practical experience
5. **Whitepapers**: AWS Well-Architected Framework

### Exam Tips:
- This game provides foundational knowledge
- Supplement with hands-on AWS Console experience
- Read AWS whitepapers and FAQs
- Take official practice exams
- Focus on understanding concepts, not memorization
- The real exam has 65 questions in 90 minutes

## 🤝 Contributing

Want to add more questions or features? Contributions are welcome!

### Adding Quiz Questions
Edit `quiz-data.js` and add questions to the appropriate category:

```javascript
{
    question: "Your question here?",
    answers: ["Option A", "Option B", "Option C", "Option D"],
    correct: 0, // Index of correct answer
    explanation: "Detailed explanation of why this is correct."
}
```

### Adding NPCs
Edit `game-data.js` to add new NPCs:

```javascript
{
    id: 'new-npc-id',
    name: 'NPC Name',
    emoji: '🎯',
    position: { x: 10, y: 10 },
    dialogs: ["Dialog text..."],
    quizCategory: 'category',
    unlocked: false,
    unlockLevel: 3
}
```

## 📝 License

MIT License - Feel free to use this for learning and teaching!

## 🙏 Acknowledgments

- Inspired by **Stardew Valley** by ConcernedApe
- AWS exam content based on official AWS documentation
- Created with ☁️ for the AWS community

## 📞 Support

Having issues or questions about AWS concepts?
- Check the [AWS Documentation](https://docs.aws.amazon.com)
- Join [AWS Community Forums](https://repost.aws)
- Review the quiz question explanations in-game

## 🎮 Start Your Cloud Journey!

```
🧑‍🌾 "Welcome to AWS Cloud Farm!"
☁️ "Every expert was once a beginner."
🎓 "Start planting your cloud knowledge today!"
```

---

**Good luck on your AWS Certified Cloud Practitioner exam!** 🚀

Remember: The cloud is not a place, it's a way of doing IT. Happy farming! 🌱☁️
