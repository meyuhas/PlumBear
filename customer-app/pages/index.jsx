import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistMessage, setWaitlistMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(waitlistEmail)) {
      setWaitlistMessage('Please enter a valid email address');
      return;
    }
    setWaitlistMessage('✅ You\'re on the waitlist! We\'ll be in touch soon.');
    setWaitlistEmail('');
    setTimeout(() => setWaitlistMessage(''), 3000);
  };

  return (
    <>
      <Head>
        <title>PlumBear - Get a Plumber Fast</title>
        <meta name="description" content="Fast, reliable plumbing services on demand" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #F97316;
          --primary-dark: #EA580C;
          --text: #1F2937;
          --text-light: #6B7280;
          --bg-light: #F9FAFB;
          --border: #E5E7EB;
          --success: #10B981;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: var(--text);
          background: white;
          line-height: 1.6;
        }

        a {
          color: var(--primary);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Navigation */
        nav {
          position: sticky;
          top: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          z-index: 100;
          transition: all 0.3s ease;
          padding: 1rem 0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-image {
          height: 36px;
          width: auto;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .nav-links {
          display: none;
          gap: 2rem;
          align-items: center;
        }

        .nav-links a {
          color: var(--text);
          font-weight: 500;
        }

        .nav-links a:hover {
          color: var(--primary);
          text-decoration: none;
        }

        .nav-cta {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .nav-cta:hover {
          background: var(--primary-dark);
          text-decoration: none;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }

        .hamburger span {
          width: 24px;
          height: 2px;
          background: var(--text);
          transition: all 0.3s ease;
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .mobile-menu.active {
          display: flex;
        }

        .mobile-menu a {
          color: var(--text);
          font-weight: 500;
        }

        /* Hero Section */
        .hero {
          padding: 4rem 20px 3rem;
          text-align: center;
          background: linear-gradient(135deg, #FFF7ED 0%, #FECACA 100%);
        }

        .launch-badge {
          display: inline-block;
          background: var(--primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 1rem 0;
          line-height: 1.2;
          color: var(--text);
        }

        .hero p {
          font-size: 1.25rem;
          color: var(--text-light);
          margin: 1rem 0 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .badge-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }

        .badge-text {
          font-size: 0.875rem;
          color: var(--text-light);
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          position: relative;
          background: white;
          color: var(--primary);
          padding: 1rem 2rem;
          border: 2px solid var(--primary);
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: var(--primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .btn-primary:hover::before {
          left: 0;
        }

        .btn-primary:hover {
          color: white;
        }

        .btn-secondary {
          background: var(--primary);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .btn-secondary:hover {
          background: var(--primary-dark);
        }

        /* Section Container */
        section {
          padding: 4rem 20px;
        }

        section h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 3rem;
          text-align: center;
        }

        section p {
          color: var(--text-light);
          line-height: 1.8;
        }

        /* How It Works */
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .step {
          background: var(--bg-light);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .step:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .step h3 {
          font-size: 1.25rem;
          margin: 1rem 0;
        }

        /* Why Choose */
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature-card {
          padding: 2rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          border-color: var(--primary);
          box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.1);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        /* Testimonials */
        .testimonials {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .testimonial {
          background: var(--bg-light);
          padding: 2rem;
          border-radius: 12px;
          border-left: 4px solid var(--primary);
        }

        .stars {
          color: #FBBF24;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .testimonial p {
          margin: 1rem 0;
          font-style: italic;
        }

        .testimonial-author {
          font-weight: 600;
          color: var(--text);
        }

        /* Advantages */
        .advantages {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .advantage-card {
          padding: 2rem;
          background: linear-gradient(135deg, #FFF7ED 0%, #FEEDDE 100%);
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .advantage-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: var(--primary);
        }

        /* Waitlist Form */
        .waitlist-section {
          background: linear-gradient(135deg, var(--primary) 0%, #EA580C 100%);
          color: white;
          text-align: center;
          padding: 4rem 20px;
        }

        .waitlist-section h2 {
          color: white;
          margin-bottom: 2rem;
        }

        .waitlist-form {
          max-width: 500px;
          margin: 0 auto;
        }

        .form-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .form-group input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
        }

        .form-group button {
          padding: 0.75rem 1.5rem;
          background: white;
          color: var(--primary);
          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .form-group button:hover {
          background: var(--bg-light);
        }

        .form-message {
          margin-top: 1rem;
          font-weight: 600;
        }

        /* Footer */
        footer {
          background: var(--text);
          color: white;
          padding: 2rem 20px;
          text-align: center;
        }

        footer a {
          color: var(--primary);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .hero h1 {
            font-size: 2rem;
          }

          .hero p {
            font-size: 1rem;
          }

          .trust-badges {
            gap: 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }

          section h2 {
            font-size: 1.75rem;
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .testimonials {
            grid-template-columns: 1fr;
          }

          .advantages {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: 2rem 15px;
          }

          .hero h1 {
            font-size: 1.5rem;
          }

          .launch-badge {
            font-size: 0.75rem;
          }

          .trust-badges {
            gap: 0.75rem;
            flex-direction: column;
          }

          .badge-number {
            font-size: 1.25rem;
          }

          section {
            padding: 2.5rem 15px;
          }

          section h2 {
            font-size: 1.5rem;
            margin-bottom: 2rem;
          }

          .step,
          .feature-card,
          .testimonial,
          .advantage-card {
            padding: 1.5rem;
          }

          .form-group {
            flex-direction: column;
          }

          .form-group button {
            width: 100%;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <img src="/logo.png" alt="PlumBear" className="logo-image" />
          <div className="nav-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#why-plumbear">Why PlumBear</a>
            <a href="#testimonials">Reviews</a>
            <a href="#waitlist" className="nav-cta">Join Waitlist</a>
          </div>
          <button
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-menu active">
            <a href="#how-it-works">How It Works</a>
            <a href="#why-plumbear">Why PlumBear</a>
            <a href="#testimonials">Reviews</a>
            <a href="#waitlist">Join Waitlist</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="launch-badge">🎉 Now Launching in Austin</div>
        <h1>Get a Plumber Fast</h1>
        <p>No wait times. No hidden fees. Just reliable plumbing services when you need them.</p>

        <div className="trust-badges">
          <div className="badge">
            <div className="badge-number">500+</div>
            <div className="badge-text">Jobs Completed</div>
          </div>
          <div className="badge">
            <div className="badge-number">4.8★</div>
            <div className="badge-text">Average Rating</div>
          </div>
          <div className="badge">
            <div className="badge-number">⚡</div>
            <div className="badge-text">Fast Response</div>
          </div>
        </div>

        <div className="cta-buttons">
          <button className="btn-primary">Learn More</button>
          <button className="btn-secondary">Book Now</button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works">
        <h2>How PlumBear Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Tell Us Your Issue</h3>
            <p>Describe your plumbing problem in seconds</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Instant Quotes</h3>
            <p>Receive multiple quotes from local plumbers</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Choose Your Plumber</h3>
            <p>Pick the best match for your needs and budget</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Problem Solved</h3>
            <p>Professional service with guaranteed satisfaction</p>
          </div>
        </div>
      </section>

      {/* Why Choose PlumBear */}
      <section id="why-plumbear">
        <h2>Why Choose PlumBear?</h2>
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Service</h3>
            <p>Get connected with available plumbers quickly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Transparent Pricing</h3>
            <p>No hidden fees, no surprises on your bill</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Verified Professionals</h3>
            <p>All plumbers are licensed and vetted</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Satisfaction Guaranteed</h3>
            <p>We stand behind every job</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Book and track from your phone anytime</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Wide Range</h3>
            <p>From emergency repairs to installations</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <h2>Real Reviews From Our Customers</h2>
        <div className="testimonials">
          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p>"PlumBear saved me so much time. The plumber arrived quickly and fixed everything perfectly!"</p>
            <div className="testimonial-author">— Sarah M., Austin</div>
          </div>
          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p>"Transparent pricing, professional service, and no hidden fees. This is exactly what I needed."</p>
            <div className="testimonial-author">— Michael R., Austin</div>
          </div>
          <div className="testimonial">
            <div className="stars">★★★★★</div>
            <p>"Best plumbing service I've used. Will definitely use PlumBear again for my next issue."</p>
            <div className="testimonial-author">— Jessica T., Austin</div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section>
        <h2>Why PlumBear is Different</h2>
        <div className="advantages">
          <div className="advantage-card">
            <h3>Matched to You</h3>
            <p>Our intelligent matching algorithm finds the perfect plumber for your specific job and location</p>
          </div>
          <div className="advantage-card">
            <h3>Rated & Reviewed</h3>
            <p>All plumbers are reviewed by customers, ensuring you get the best professional for the job</p>
          </div>
          <div className="advantage-card">
            <h3>Real-Time Tracking</h3>
            <p>Know exactly when your plumber will arrive with live location updates</p>
          </div>
          <div className="advantage-card">
            <h3>Secure Payments</h3>
            <p>Safe payment processing protects both you and your plumber</p>
          </div>
          <div className="advantage-card">
            <h3>Local Experts</h3>
            <p>Austin-based plumbers who know the area and local codes inside and out</p>
          </div>
          <div className="advantage-card">
            <h3>24/7 Support</h3>
            <p>Questions or issues? Our support team is here to help anytime</p>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="waitlist-section" id="waitlist">
        <h2>Join the PlumBear Movement</h2>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          Be among the first to experience the future of plumbing services in Austin
        </p>
        <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              required
            />
            <button type="submit">Join Now</button>
          </div>
          {waitlistMessage && (
            <div className="form-message">{waitlistMessage}</div>
          )}
        </form>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 PlumBear. All rights reserved.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          <a href="#privacy">Privacy</a> • <a href="#terms">Terms</a> • <a href="#contact">Contact</a>
        </p>
      </footer>
    </>
  );
}
