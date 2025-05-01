const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment', async (req, res) => {
    const { amount, currency, description } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: currency || 'usd',
            description: description || 'Blog subscription payment',
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: 'Payment failed', error: error.message });
    }
});

module.exports = router;