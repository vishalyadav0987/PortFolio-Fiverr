const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Gig title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    thumbnailImages: [
        {
            public_id: { type: String, required: true },
            url: { type: String, required: true }
        }
    ],
    description: {
        type: String,
        required: [true, 'Gig description is required']
    },
    DetailedAboutYourself: {
        from: { type: String, required: true },
        since: { type: String, required: true },
        AvgResponseT: { type: String, required: true },
        Languages: { type: [String], required: true },
        AboutMe: { type: String, required: true }
    },
    MyPortfolio: [
        {
            projectTitle: { type: String, required: true },
            projectImages: [
                {
                    public_id: { type: String, required: true },
                    url: { type: String, required: true }
                }
            ],
            languagesUsed: { type: [String], required: true },
            projectDescription: { type: String, required: true },
            projectDateFrom: { type: Date, required: true },
            projectCostRange: {
                min: { type: Number, required: true },
                max: { type: Number, required: true }
            },
            projectDuration: { type: String, required: true }
        }
    ],
    PricingPlans: [
        {
            planType: { type: String, enum: ['Basic', 'Standard', 'Premium'], required: true },
            price: { type: Number, required: true },
            title: { type: String, required: true },
            shortDescription: { type: String, required: true },
            deliveryDays: { type: Number, required: true },
            revisionCount: { type: Number, required: true },
            features: { type: [String], required: true }
        }
    ],
    extraFeatures: [
        {
            name: { type: String, required: true },
            description: String,
            price: { type: Number, required: true }
        }
    ],
    FAQ: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true }
        }
    ],
    projectDetails: {  // Combined field for websiteType, techStack, functionality
        websiteType: {
            type: String,
            required: true
        },
        techStack: [String],          // e.g., ['React', 'Node.js']
        functionality: [String]       // e.g., ['Contact Form', 'Admin Panel']
    },
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [
        {
            userRevId: { type: mongoose.Schema.ObjectId, ref: "user" },
            orderId:{type: mongoose.Schema.ObjectId, ref: "order"},
            name: { type: String, required: true },
            avatar: { type: String },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            edited: { type: Boolean, default: false }
        }
    ],
    likes: [
        {
            userId: { type: mongoose.Schema.ObjectId, ref: "user" }   // Storing user id for like functionality
        }
    ],
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('gig', GigSchema);
