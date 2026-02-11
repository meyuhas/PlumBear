import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        { headers: { 'Authorization': 'Bearer plumber-token' } }
      );
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Demo jobs if API fails
      setJobs([
        {
          id: 1,
          customer_name: 'Sarah Johnson',
          location: '123 Oak Street, Austin TX',
          issue_type: 'Leaky Faucet',
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'accepted', plumber_id: 'plumber-1' }),
        }
      );
      if (response.ok) {
        fetchJobs();
        setActiveJob(null);
      }
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const handleDeclineJob = (jobId) => {
    setJobs(jobs.filter((j) => j.id !== jobId));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Loading jobs...</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🔧 PlumBear Dashboard</h1>
        <p>Available Jobs: {jobs.filter((j) => j.status === 'pending').length}</p>
      </header>

      <main className={styles.main}>
        {jobs.length === 0 ? (
          <div className={styles.noJobs}>
            <h2>No jobs available right now</h2>
            <p>Check back soon for new plumbing requests!</p>
          </div>
        ) : (
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`${styles.jobCard} ${
                  job.status === 'pending' ? styles.pending : styles.completed
                }`}
              >
                <div className={styles.jobHeader}>
                  <h3>{job.customer_name}</h3>
                  <span className={styles.status}>{job.status}</span>
                </div>
                <p className={styles.issue}>
                  <strong>Issue:</strong> {job.issue_type}
                </p>
                <p className={styles.location}>
                  <strong>Location:</strong> {job.location}
                </p>
                <p className={styles.time}>
                  Posted {new Date(job.created_at).toLocaleString()}
                </p>

                {job.status === 'pending' && (
                  <div className={styles.actions}>
                    <button
                      className={styles.acceptBtn}
                      onClick={() => handleAcceptJob(job.id)}
                    >
                      ✅ Accept Job
                    </button>
                    <button
                      className={styles.declineBtn}
                      onClick={() => handleDeclineJob(job.id)}
                    >
                      ❌ Decline
                    </button>
                  </div>
                )}
                {job.status !== 'pending' && (
                  <div className={styles.completed}>
                    <p>✓ Completed</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>💰 Earn 80% of every job you complete</p>
        <p>Stay active • Build reputation • Get more jobs</p>
      </footer>
    </div>
  );
}
