const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    addressInfo: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        phoneNo: { type: Number }
    },
    OrderItems: [
        {
            title: { type: String, required: true }, // ✅
            thumbnailImage: {
                public_id: { type: String, required: true },
                url: { type: String, required: true }
            }, // id  se milega ✅
            selectedPlan: {
                planType: { type: String, enum: ['Basic', 'Standard', 'Premium'], required: true }, // ✅
                price: { type: Number, required: true }, // ✅
                title: { type: String, required: true }, // ✅
                shortDescription: { type: String, required: true }, // ✅
                deliveryDays: { type: Number, required: true }, // ✅
                revisionCount: { type: Number, required: true }, // ✅
                features: { type: [String], required: true } // ✅
            },
            extraFeatures: [
                {
                    name: { type: String, required: true },
                    description: { type: String },
                    price: { type: Number, required: true },
                    quantity: { type: Number, required: true, default: 1 },
                }
            ],
            quantity: { type: Number, required: true, default: 1 }, // ✅
            gigId: { type: mongoose.Schema.ObjectId, ref: "gig", required: true } // ✅
        }
    ],
    buyerId: { type: mongoose.Schema.ObjectId, ref: 'user', required: true },
    orderStatus: {
        type: String,
        enum: ['Rejected', 'In Progress', 'Accepted', 'Delivered'],
        default: 'In Progress'
    },
    deliveryDate: { type: Date },

    // Payment Fields
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        mileStoneId: {
            type: String,
            // required: true
        },
        paymentType: { type: String, enum: ['Full', 'Milestone'], required: true },
        paymentStatus: { type: String, enum: ['Pending', 'Partially Paid', 'Paid', 'Failed'], default: 'Pending' },
        paidAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },
        paymentScreenshot: {  // Screenshot proof (optional but recommended)
            public_id: { type: String },
            url: { type: String }
        },
        paidAt: {
            type: Date,
            required: true,
        },
    },

    // Revision Fields
    usedRevisions: { type: Number, default: 0 },
    maxRevisions: { type: Number, required: true },
    revisionRequests: [
        {
            orderId: { type: mongoose.Schema.ObjectId, ref: 'order', required: true },
            buyerId: { type: mongoose.Schema.ObjectId, ref: 'user', required: true }, // auto
            revisionDescription: { type: String, required: true },
            requestedAt: { type: Date, default: Date.now }, // auto
            completedAt: { type: Date }, // auto
            status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' }, // auto
        }
    ],


}, { timestamps: true });

OrderSchema.pre('save', function (next) {
    if (!this.paymentInfo.mileStoneId) {
        this.paymentInfo.mileStoneId = this.paymentInfo.id; // Set mileStoneId = id
    }
    next();
});


module.exports = mongoose.model('order', OrderSchema);
