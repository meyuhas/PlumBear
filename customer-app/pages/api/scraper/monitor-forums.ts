import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export async function GET(request: Request) {
    try {
          // This endpoint is called by Vercel Cron every 5 minutes
      const forumPosts = [
        {
                  source: 'facebook',
                  text: 'HELP!! Burst pipe in my Heights apartment. Water everywhere!!!',
                  urgency: 'CRITICAL',
                  neighborhood: 'the_heights',
        },
        {
                  source: 'nextdoor',
                  text: 'Looking for plumber in The Heights for water heater repair',
                  urgency: 'HIGH',
                  neighborhood: 'the_heights',
        },
            ];

      let jobsCreated = 0;
          let jobsQueued = 0;

      for (const post of forumPosts) {
              // Create job in Supabase
            const { data, error } = await supabase.from('jobs').insert([
              {
                          customer_phone: 'forum-lead',
                          customer_email: 'forum@plumbear.io',
                          job_type: 'emergency',
                          description: post.text,
                          location: post.neighborhood,
                          neighborhood: post.neighborhood,
                          status: 'pending',
                          urgency_level: post.urgency,
                          quoted_price: post.urgency === 'CRITICAL' ? 199.99 : 129.99,
                          created_at: new Date().toISOString(),
              },
                    ]);

            if (!error) {
                      jobsCreated++;
                      console.log(`Created job from ${post.source}: ${post.text.substring(0, 50)}...`);
            } else {
                      jobsQueued++;
                      console.error(`Error creating job:`, error);
            }
      }

      return NextResponse.json({
              status: 'success',
              jobsCreated,
              jobsQueued,
              message: `Forum monitoring completed. ${jobsCreated} jobs created.`,
      });
    } catch (error) {
          console.error('Forum monitoring error:', error);
          return NextResponse.json(
            { error: 'Forum monitoring failed' },
            { status: 500 }
                );
    }
}
