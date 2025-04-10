require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount * 100, // Convert to paise
            currency: "inr",
            payment_method_types: ['card', 'upi', 'wallet'], // Enable multiple payment methods
            automatic_payment_methods: { enabled: true }, // Auto-detect available methods
            metadata: {
                company: "PortFolio-Fiverr",
                userId: req.body.userId, // Optional for tracking payments per user
            },
        });

        res.json({ success: true, client_secret: myPayment.client_secret });
    } catch (error) {
        console.log("Error in processPayment", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send Stripe Public Key to Frontend
const sendStripeApiKey = async (req, res) => {
    res.json({ success: true, stripeApiKey: process.env.STRIPE_API_KEY });
};

module.exports = {
    processPayment,
    sendStripeApiKey
};
