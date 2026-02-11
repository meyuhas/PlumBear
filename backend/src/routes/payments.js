const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/intent - Create Stripe payment intent
router.post('/intent', async (req, res) => {
  try {
    const { job_id, amount } = req.body;

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', job_id)
      .single();

    if (jobError) throw jobError;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        job_id,
        customer_id: job.customer_id,
        plumber_id: job.plumber_id
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payments/confirm - Confirm payment and process payout
router.post('/confirm', async (req, res) => {
  try {
    const { job_id, payment_intent_id, amount } = req.body;

    // Get job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', job_id)
      .single();

    if (jobError) throw jobError;

    // Calculate split: 80% plumber, 20% platform
    const platformFee = Math.round(amount * 0.2);
    const plumberPayout = amount - platformFee;

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        job_id,
        customer_id: job.customer_id,
        plumber_id: job.plumber_id,
        amount,
        platform_fee: platformFee,
        plumber_payout: plumberPayout,
        stripe_payment_intent_id: payment_intent_id,
        status: 'completed'
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Update job status
    await supabase
      .from('jobs')
      .update({ status: 'completed' })
      .eq('id', job_id);

    res.json({
      success: true,
      payment_id: payment.id,
      plumber_payout: plumberPayout
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
