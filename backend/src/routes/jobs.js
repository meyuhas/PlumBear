const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const supabase = require('../db/supabase');

// POST /api/jobs - Create new job (customer booking)
router.post('/', async (req, res) => {
  try {
    const { phone, name, address, issue_type, description, latitude, longitude } = req.body;

    if (!phone || !address || !issue_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Find or create customer
    let { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();

    if (!customer) {
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          phone,
          name,
          address,
          latitude,
          longitude
        })
        .select()
        .single();

      if (createError) throw createError;
      customer = newCustomer;
    }

    // 2. Create job
    const estimatedPrice = getEstimatedPrice(issue_type);
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        customer_id: customer.id,
        issue_type,
        description,
        address,
        latitude,
        longitude,
        estimated_price: estimatedPrice,
        status: 'pending'
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // 3. Find nearby plumbers and match
    const matchedPlumber = await findNearbyPlumber(latitude, longitude);

    if (matchedPlumber) {
      // Send job notification to plumber
      await notifyPlumber(matchedPlumber, job);

      // Update job with matched plumber
      await supabase
        .from('jobs')
        .update({ plumber_id: matchedPlumber.id, status: 'matched' })
        .eq('id', job.id);
    }

    res.status(201).json({
      success: true,
      job_id: job.id,
      customer_id: customer.id,
      estimated_price: estimatedPrice,
      matched_plumber: matchedPlumber ? matchedPlumber.name : null
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jobs/:id - Get job details
router.get('/:id', async (req, res) => {
  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        customer:customers(*),
        plumber:plumbers(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/jobs/:id - Update job status
router.patch('/:id', async (req, res) => {
  try {
    const { status, final_price } = req.body;

    const updateData = { status, updated_at: new Date().toISOString() };
    if (final_price) updateData.final_price = final_price;
    if (status === 'started') updateData.started_at = new Date().toISOString();
    if (status === 'completed') updateData.completed_at = new Date().toISOString();

    const { data: job, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function getEstimatedPrice(issueType) {
  const prices = {
    'clogged_drain': 120,
    'leak_detection': 100,
    'water_heater': 200,
    'fixture_repair': 150,
    'pipe_replacement': 250,
    'general': 130
  };
  return prices[issueType] || prices.general;
}

async function findNearbyPlumber(latitude, longitude, radiusKm = 10) {
  // Simplified: get any available plumber
  // In production: use PostGIS for distance calculation
  const { data: plumbers, error } = await supabase
    .from('plumbers')
    .select('*')
    .eq('available', true)
    .limit(1);

  if (error) throw error;
  return plumbers && plumbers.length > 0 ? plumbers[0] : null;
}

async function notifyPlumber(plumber, job) {
  // TODO: Send SMS via Twilio
  console.log(`Notifying plumber ${plumber.name} about job ${job.id}`);
}

module.exports = router;
