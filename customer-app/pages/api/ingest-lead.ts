import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateJobPrice } from '../lib/pricingEngine';
import { classifyUrgency } from '../lib/urgencyEngine';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export async function POST(request: Request) {
    try {
          const body = await request.json();
          const { phone, email, jobType, description, location, neighborhood } = body;

      // Validate geofence
      const zone = process.env.NEXT_PUBLIC_OPERATING_ZONE || 'the_heights';
          if (neighborhood?.toLowerCase() !== zone.toLowerCase()) {
                  return NextResponse.json(
                    { status: 'coming_soon', message: `We're coming soon to your area!` },
                    { status: 202 }
                          );
          }

      // Classify urgency
      const urgencyResult = classifyUrgency(description, jobType);

      // Calculate price
      const pricingResult = calculateJobPrice({
              jobType: jobType as any,
              urgencyLevel: urgencyResult.urgencyLevel,
              neighborhood: neighborhood || zone,
      });

      // Create job in Supabase
      const { data, error } = await supabase.from('jobs').insert([
        {
                  customer_phone: phone,
                  customer_email: email,
                  job_type: jobType,
                  description,
                  location,
                  neighborhood: neighborhood || zone,
                  status: 'pending',
                  urgency_level: urgencyResult.urgencyLevel,
                  quoted_price: pricingResult.finalPrice,
                  created_at: new Date().toISOString(),
        },
            ]);

      if (error) throw error;

      return NextResponse.json({
              status: 'success',
              jobId: data?.[0]?.id,
              price: pricingResult.finalPrice,
              message: 'Job submitted! Plumber en route.',
      });
    } catch (error) {
          console.error('ingest-lead error:', error);
          return NextResponse.json(
            { error: 'Failed to process job' },
            { status: 500 }
                );
    }
}
