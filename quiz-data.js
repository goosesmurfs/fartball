// AWS Certified Cloud Practitioner Quiz Database
// Organized by exam domains

const quizData = {
    cloudConcepts: [
        {
            question: "What is the primary benefit of cloud computing's elasticity?",
            answers: [
                "Resources can automatically scale up or down based on demand",
                "Data is stored in multiple locations",
                "Services are available 24/7",
                "Applications run faster"
            ],
            correct: 0,
            explanation: "Elasticity allows resources to scale automatically to match workload demands, ensuring optimal performance and cost efficiency."
        },
        {
            question: "Which cloud deployment model provides dedicated hardware for a single organization?",
            answers: [
                "Public Cloud",
                "Private Cloud",
                "Hybrid Cloud",
                "Community Cloud"
            ],
            correct: 1,
            explanation: "A Private Cloud is dedicated to a single organization, providing greater control and security."
        },
        {
            question: "What does 'pay-as-you-go' pricing mean in cloud computing?",
            answers: [
                "Pay upfront for reserved capacity",
                "Pay only for the resources you actually use",
                "Pay a flat monthly fee regardless of usage",
                "Pay based on the number of users"
            ],
            correct: 1,
            explanation: "Pay-as-you-go means you only pay for the compute resources you consume, with no upfront costs or long-term commitments."
        },
        {
            question: "Which of the following is an example of horizontal scaling?",
            answers: [
                "Upgrading from a t2.micro to t2.large instance",
                "Adding more RAM to an existing server",
                "Adding more EC2 instances behind a load balancer",
                "Increasing the storage size of an EBS volume"
            ],
            correct: 2,
            explanation: "Horizontal scaling (scaling out) involves adding more instances/servers rather than making existing ones more powerful."
        },
        {
            question: "What is the AWS Well-Architected Framework pillar focused on using resources efficiently?",
            answers: [
                "Operational Excellence",
                "Security",
                "Cost Optimization",
                "Performance Efficiency"
            ],
            correct: 2,
            explanation: "The Cost Optimization pillar focuses on avoiding unnecessary costs and using resources efficiently."
        }
    ],

    ec2: [
        {
            question: "What is Amazon EC2?",
            answers: [
                "A serverless computing service",
                "Virtual servers in the cloud",
                "A managed database service",
                "A content delivery network"
            ],
            correct: 1,
            explanation: "Amazon EC2 (Elastic Compute Cloud) provides resizable virtual servers (instances) in the cloud."
        },
        {
            question: "Which EC2 pricing model offers the most cost savings for steady-state workloads?",
            answers: [
                "On-Demand Instances",
                "Spot Instances",
                "Reserved Instances",
                "Dedicated Hosts"
            ],
            correct: 2,
            explanation: "Reserved Instances offer up to 75% discount compared to On-Demand pricing for committed usage over 1 or 3 years."
        },
        {
            question: "What is an EC2 Security Group?",
            answers: [
                "A group of EC2 instances",
                "A virtual firewall that controls inbound and outbound traffic",
                "A collection of IAM users",
                "A monitoring tool for EC2"
            ],
            correct: 1,
            explanation: "Security Groups act as virtual firewalls that control inbound and outbound traffic for EC2 instances."
        },
        {
            question: "Which service automatically distributes incoming traffic across multiple EC2 instances?",
            answers: [
                "Amazon Route 53",
                "AWS Auto Scaling",
                "Elastic Load Balancing",
                "Amazon CloudFront"
            ],
            correct: 2,
            explanation: "Elastic Load Balancing automatically distributes incoming application traffic across multiple targets, such as EC2 instances."
        },
        {
            question: "What is the purpose of an Amazon Machine Image (AMI)?",
            answers: [
                "To monitor EC2 instances",
                "To provide a template for launching EC2 instances",
                "To backup EC2 data",
                "To encrypt EC2 storage"
            ],
            correct: 1,
            explanation: "An AMI provides the information required to launch an EC2 instance, including the OS, applications, and configuration."
        }
    ],

    storage: [
        {
            question: "What is Amazon S3 primarily used for?",
            answers: [
                "Running virtual servers",
                "Object storage for files and backups",
                "Relational database storage",
                "Content delivery"
            ],
            correct: 1,
            explanation: "Amazon S3 (Simple Storage Service) is an object storage service for storing and retrieving any amount of data."
        },
        {
            question: "Which S3 storage class is most cost-effective for infrequently accessed data?",
            answers: [
                "S3 Standard",
                "S3 Intelligent-Tiering",
                "S3 Standard-IA (Infrequent Access)",
                "S3 Glacier"
            ],
            correct: 2,
            explanation: "S3 Standard-IA is designed for data that is accessed less frequently but requires rapid access when needed, at a lower cost than S3 Standard."
        },
        {
            question: "What is the maximum file size for a single S3 object?",
            answers: [
                "5 GB",
                "100 GB",
                "5 TB",
                "Unlimited"
            ],
            correct: 2,
            explanation: "The maximum size for a single S3 object is 5 TB."
        },
        {
            question: "Which storage service provides file storage for EC2 instances that multiple instances can access simultaneously?",
            answers: [
                "Amazon EBS",
                "Amazon S3",
                "Amazon EFS",
                "AWS Storage Gateway"
            ],
            correct: 2,
            explanation: "Amazon EFS (Elastic File System) provides shared file storage that can be mounted by multiple EC2 instances simultaneously."
        },
        {
            question: "What is Amazon EBS?",
            answers: [
                "Object storage for S3",
                "Block-level storage volumes for EC2",
                "A backup service",
                "A database service"
            ],
            correct: 1,
            explanation: "Amazon EBS (Elastic Block Store) provides persistent block-level storage volumes for use with EC2 instances."
        }
    ],

    database: [
        {
            question: "Which AWS service is a fully managed relational database?",
            answers: [
                "Amazon DynamoDB",
                "Amazon RDS",
                "Amazon Redshift",
                "Amazon ElastiCache"
            ],
            correct: 1,
            explanation: "Amazon RDS (Relational Database Service) is a managed service for relational databases like MySQL, PostgreSQL, and Oracle."
        },
        {
            question: "What type of database is Amazon DynamoDB?",
            answers: [
                "Relational database",
                "Graph database",
                "NoSQL database",
                "Data warehouse"
            ],
            correct: 2,
            explanation: "DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability."
        },
        {
            question: "Which database service is best suited for data warehousing and analytics?",
            answers: [
                "Amazon RDS",
                "Amazon DynamoDB",
                "Amazon Redshift",
                "Amazon ElastiCache"
            ],
            correct: 2,
            explanation: "Amazon Redshift is a fast, fully managed data warehouse service optimized for analyzing large datasets."
        },
        {
            question: "What does Amazon RDS Multi-AZ deployment provide?",
            answers: [
                "Better read performance",
                "Lower costs",
                "High availability and automatic failover",
                "Increased storage capacity"
            ],
            correct: 2,
            explanation: "Multi-AZ deployment provides enhanced availability and durability with automatic failover to a standby replica in a different Availability Zone."
        },
        {
            question: "Which service provides in-memory caching to improve application performance?",
            answers: [
                "Amazon RDS",
                "Amazon DynamoDB",
                "Amazon ElastiCache",
                "Amazon Aurora"
            ],
            correct: 2,
            explanation: "Amazon ElastiCache is a fully managed in-memory caching service supporting Redis and Memcached."
        }
    ],

    networking: [
        {
            question: "What is Amazon VPC?",
            answers: [
                "A virtual private cloud for isolating AWS resources",
                "A content delivery network",
                "A load balancing service",
                "A domain name system"
            ],
            correct: 0,
            explanation: "Amazon VPC (Virtual Private Cloud) lets you provision a logically isolated section of the AWS Cloud where you can launch resources."
        },
        {
            question: "What is Amazon CloudFront?",
            answers: [
                "A DNS service",
                "A content delivery network (CDN)",
                "A firewall service",
                "A VPN service"
            ],
            correct: 1,
            explanation: "CloudFront is a global CDN that delivers data, videos, applications, and APIs with low latency and high transfer speeds."
        },
        {
            question: "Which service translates domain names to IP addresses?",
            answers: [
                "Amazon VPC",
                "Amazon Route 53",
                "Amazon CloudFront",
                "AWS Direct Connect"
            ],
            correct: 1,
            explanation: "Amazon Route 53 is a scalable DNS (Domain Name System) web service."
        },
        {
            question: "What is the purpose of an Internet Gateway in a VPC?",
            answers: [
                "To connect to on-premises networks",
                "To enable communication between VPC and the internet",
                "To filter network traffic",
                "To balance load across instances"
            ],
            correct: 1,
            explanation: "An Internet Gateway enables communication between instances in your VPC and the internet."
        },
        {
            question: "Which AWS service provides a dedicated network connection from on-premises to AWS?",
            answers: [
                "AWS VPN",
                "AWS Direct Connect",
                "Amazon VPC Peering",
                "Amazon CloudFront"
            ],
            correct: 1,
            explanation: "AWS Direct Connect establishes a dedicated network connection from your premises to AWS, providing more consistent network performance."
        }
    ],

    security: [
        {
            question: "What is AWS IAM?",
            answers: [
                "A monitoring service",
                "Identity and Access Management service",
                "A backup service",
                "A database service"
            ],
            correct: 1,
            explanation: "AWS IAM (Identity and Access Management) enables you to manage access to AWS services and resources securely."
        },
        {
            question: "What is the AWS Shared Responsibility Model?",
            answers: [
                "AWS is responsible for everything",
                "Customer is responsible for everything",
                "Security and compliance is shared between AWS and the customer",
                "Only applies to government customers"
            ],
            correct: 2,
            explanation: "The Shared Responsibility Model defines which security responsibilities are AWS's (security OF the cloud) and which are the customer's (security IN the cloud)."
        },
        {
            question: "Which service helps protect web applications from common exploits?",
            answers: [
                "AWS Shield",
                "AWS WAF",
                "Amazon Inspector",
                "AWS GuardDuty"
            ],
            correct: 1,
            explanation: "AWS WAF (Web Application Firewall) helps protect web applications from common web exploits that could affect availability or security."
        },
        {
            question: "What does AWS Shield protect against?",
            answers: [
                "SQL injection attacks",
                "DDoS attacks",
                "Unauthorized access",
                "Data breaches"
            ],
            correct: 1,
            explanation: "AWS Shield is a managed DDoS (Distributed Denial of Service) protection service."
        },
        {
            question: "Which service provides automated security assessments for EC2 instances?",
            answers: [
                "AWS Inspector",
                "AWS GuardDuty",
                "AWS Config",
                "AWS CloudTrail"
            ],
            correct: 0,
            explanation: "Amazon Inspector is an automated security assessment service that helps improve the security and compliance of applications."
        },
        {
            question: "What is the best practice for the AWS account root user?",
            answers: [
                "Use it for daily administrative tasks",
                "Share credentials with the team",
                "Enable MFA and use it only for account management tasks",
                "Disable it completely"
            ],
            correct: 2,
            explanation: "Best practice is to enable MFA on the root account and only use it for tasks that require root access, using IAM users for daily tasks."
        }
    ],

    pricing: [
        {
            question: "Which tool helps estimate the cost of AWS services?",
            answers: [
                "AWS Cost Explorer",
                "AWS Pricing Calculator",
                "AWS Budgets",
                "AWS Cost and Usage Report"
            ],
            correct: 1,
            explanation: "AWS Pricing Calculator helps you estimate the cost of AWS services for your use case before you start using them."
        },
        {
            question: "What is AWS Free Tier?",
            answers: [
                "Free AWS services forever",
                "Limited free usage of AWS services for new accounts",
                "Discount program for students",
                "Free training courses"
            ],
            correct: 1,
            explanation: "AWS Free Tier provides limited free usage of many AWS services for 12 months for new AWS accounts, plus always-free and trial offers."
        },
        {
            question: "Which pricing model allows you to bid on spare EC2 capacity?",
            answers: [
                "On-Demand",
                "Reserved Instances",
                "Spot Instances",
                "Savings Plans"
            ],
            correct: 2,
            explanation: "Spot Instances let you bid on spare EC2 capacity at up to 90% discount compared to On-Demand prices."
        },
        {
            question: "What does AWS Cost Explorer help you do?",
            answers: [
                "Predict future costs",
                "Visualize and analyze your AWS costs and usage over time",
                "Calculate ROI",
                "Negotiate better pricing"
            ],
            correct: 1,
            explanation: "AWS Cost Explorer provides visualization and analysis of your AWS costs and usage, helping identify trends and cost drivers."
        },
        {
            question: "Which service allows you to set custom budgets and receive alerts?",
            answers: [
                "AWS Cost Explorer",
                "AWS Pricing Calculator",
                "AWS Budgets",
                "AWS Billing Dashboard"
            ],
            correct: 2,
            explanation: "AWS Budgets lets you set custom cost and usage budgets and receive alerts when you exceed or are forecasted to exceed your budgets."
        }
    ],

    lambda: [
        {
            question: "What is AWS Lambda?",
            answers: [
                "A virtual server service",
                "A serverless compute service that runs code in response to events",
                "A container orchestration service",
                "A database service"
            ],
            correct: 1,
            explanation: "AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the compute resources."
        },
        {
            question: "How is AWS Lambda billed?",
            answers: [
                "Fixed monthly fee",
                "By the hour",
                "By the number of requests and compute time",
                "By storage used"
            ],
            correct: 2,
            explanation: "Lambda charges based on the number of requests and the duration your code executes (compute time)."
        },
        {
            question: "What is the maximum execution time for a Lambda function?",
            answers: [
                "5 minutes",
                "15 minutes",
                "1 hour",
                "24 hours"
            ],
            correct: 1,
            explanation: "Lambda functions have a maximum execution time (timeout) of 15 minutes."
        },
        {
            question: "Which of the following can trigger a Lambda function?",
            answers: [
                "S3 events",
                "DynamoDB streams",
                "API Gateway requests",
                "All of the above"
            ],
            correct: 3,
            explanation: "Lambda functions can be triggered by many AWS services including S3, DynamoDB, API Gateway, and many others."
        }
    ],

    monitoring: [
        {
            question: "What is Amazon CloudWatch?",
            answers: [
                "A security monitoring service",
                "A monitoring and observability service for AWS resources",
                "A log storage service",
                "A network monitoring tool"
            ],
            correct: 1,
            explanation: "CloudWatch is a monitoring and observability service that collects metrics, logs, and events from AWS resources and applications."
        },
        {
            question: "What does AWS CloudTrail do?",
            answers: [
                "Monitors application performance",
                "Records API calls made in your AWS account",
                "Delivers content globally",
                "Backs up data"
            ],
            correct: 1,
            explanation: "AWS CloudTrail records API calls made in your account, providing governance, compliance, and audit capabilities."
        },
        {
            question: "Which service can send notifications when a CloudWatch alarm is triggered?",
            answers: [
                "Amazon SES",
                "Amazon SNS",
                "Amazon SQS",
                "AWS Lambda"
            ],
            correct: 1,
            explanation: "Amazon SNS (Simple Notification Service) can send notifications via email, SMS, or other methods when CloudWatch alarms are triggered."
        },
        {
            question: "What is AWS Config used for?",
            answers: [
                "Configuring EC2 instances",
                "Assessing, auditing, and evaluating configurations of AWS resources",
                "Managing IAM policies",
                "Setting up VPCs"
            ],
            correct: 1,
            explanation: "AWS Config continuously monitors and records your AWS resource configurations and allows you to evaluate them for compliance."
        }
    ],

    support: [
        {
            question: "Which AWS Support plan provides 24/7 access to Cloud Support Engineers?",
            answers: [
                "Basic",
                "Developer",
                "Business",
                "All plans"
            ],
            correct: 2,
            explanation: "Business and Enterprise Support plans provide 24/7 access to Cloud Support Engineers via phone, chat, and email."
        },
        {
            question: "What does AWS Trusted Advisor provide?",
            answers: [
                "Technical support",
                "Real-time guidance to help optimize AWS infrastructure",
                "Training courses",
                "Cost estimates"
            ],
            correct: 1,
            explanation: "AWS Trusted Advisor provides real-time guidance to help you provision resources following AWS best practices for cost optimization, performance, security, and fault tolerance."
        },
        {
            question: "Which AWS Support plan is free?",
            answers: [
                "Developer",
                "Business",
                "Basic",
                "Enterprise"
            ],
            correct: 2,
            explanation: "The Basic Support plan is included free for all AWS customers and provides account and billing support."
        },
        {
            question: "What is AWS Personal Health Dashboard?",
            answers: [
                "A fitness tracking service",
                "A personalized view of AWS service health and alerts relevant to your resources",
                "A support ticket system",
                "A training portal"
            ],
            correct: 1,
            explanation: "AWS Personal Health Dashboard provides alerts and guidance when AWS is experiencing events that may impact your resources."
        }
    ]
};

// Helper function to get random questions from a category
function getRandomQuestions(category, count = 5) {
    const questions = quizData[category] || [];
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Get mixed questions from all categories
function getMixedQuestions(count = 10) {
    const allQuestions = Object.values(quizData).flat();
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, allQuestions.length));
}

// Get questions by difficulty (we'll categorize based on content)
function getQuestionsByLevel(level) {
    switch(level) {
        case 1: // Beginner - Cloud concepts and basics
            return [...getRandomQuestions('cloudConcepts', 3), ...getRandomQuestions('pricing', 2)];
        case 2: // Intermediate - Core services
            return [...getRandomQuestions('ec2', 2), ...getRandomQuestions('storage', 2), ...getRandomQuestions('database', 1)];
        case 3: // Advanced - Networking and security
            return [...getRandomQuestions('networking', 2), ...getRandomQuestions('security', 3)];
        default:
            return getMixedQuestions(5);
    }
}
