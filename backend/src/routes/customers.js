const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

// GET /api/customers/:phone - Get customer by phone
router.get('/:phone', async (req, res) => {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', req.params.phone)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    res.json(customer || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/customers/:id/jobs - Get customer's jobs
router.get('/:id/jobs', async (req, res) => {
  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(`
        *,
        plumber:plumbers(name, phone, rating),
        reviews:reviews(*)
      `)
      .eq('customer_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
