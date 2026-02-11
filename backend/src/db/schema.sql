-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  name VARCHAR(255),
  address TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plumbers table
CREATE TABLE IF NOT EXISTS plumbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  license_number VARCHAR(50),
  rating FLOAT DEFAULT 5.0,
  total_jobs INT DEFAULT 0,
  latitude FLOAT,
  longitude FLOAT,
  available BOOLEAN DEFAULT TRUE,
  hourly_rate INT DEFAULT 120,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  plumber_id UUID REFERENCES plumbers(id),
  issue_type VARCHAR(50),
  description TEXT,
  address TEXT,
  latitude FLOAT,
  longitude FLOAT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, matched, accepted, started, completed, cancelled
  estimated_price INT,
  final_price INT,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  plumber_id UUID NOT NULL REFERENCES plumbers(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  plumber_id UUID NOT NULL REFERENCES plumbers(id),
  amount INT,
  platform_fee INT,
  plumber_payout INT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_plumber ON jobs(plumber_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_reviews_plumber ON reviews(plumber_id);
CREATE INDEX idx_payments_job ON payments(job_id);
