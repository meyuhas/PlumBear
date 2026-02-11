const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// GET /api/plumbers - List all plumbers
router.get('/', async (req, res) => {
  try {
    const { data: plumbers, error } = await supabase
      .from('plumbers')
      .select('*')
      .order('rating', { ascending: false });

    if (error) throw error;
    res.json(plumbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/plumbers - Register new plumber
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, license_number } = req.body;

    if (!name || !phone || !license_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: plumber, error } = await supabase
      .from('plumbers')
      .insert({
        name,
        phone,
        email,
        license_number,
        available: true
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(plumber);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/plumbers/:id - Get plumber details
router.get('/:id', async (req, res) => {
  try {
    const { data: plumber, error } = await supabase
      .from('plumbers')
      .select(`
        *,
        jobs:jobs(count),
        reviews:reviews(*)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(plumber);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/plumbers/:id - Update plumber (availability, location, etc)
router.patch('/:id', async (req, res) => {
  try {
    const { available, latitude, longitude } = req.body;

    const updateData = {};
    if (available !== undefined) updateData.available = available;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    updateData.updated_at = new Date().toISOString();

    const { data: plumber, error } = await supabase
      .from('plumbers')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(plumber);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/plumbers/:id/jobs - Get plumber's jobs
router.get('/:id/jobs', async (req, res) => {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('plumber_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
