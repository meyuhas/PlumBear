import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/jobs`, {
        headers: { 'Authorization': 'Bearer plumber-token' },
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted', plumber_id: 'plumber-1' }),
      });
      if (response.ok) fetchJobs();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeclineJob = (jobId) => {
    setJobs(jobs.filter((j) => j.id !== jobId));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #ff6b35', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '36px', color: '#333' }}>🔧 PlumBear Dashboard</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>Available Jobs: {jobs.filter((j) => j.status === 'pending').length}</p>
      </header>

      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><h2>Loading jobs...</h2></div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h2>No jobs available right now</h2>
            <p>Check back soon for new plumbing requests!</p>
          </div>
        ) : (
          <div>
            {jobs.map((job) => (
              <div key={job.id} style={{
                marginBottom: '20px', padding: '20px',
                border: job.status === 'pending' ? '2px solid #ff6b35' : '2px solid #4caf50',
                borderRadius: '8px',
                backgroundColor: job.status === 'pending' ? '#fff9f5' : '#f1f8f4',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>{job.customer_name}</h3>
                  <span style={{
                    padding: '5px 10px', borderRadius: '4px',
                    backgroundColor: job.status === 'pending' ? '#ff6b35' : '#4caf50',
                    color: 'white', fontSize: '12px',
                  }}>
                    {job.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ margin: '8px 0' }}><strong>Issue:</strong> {job.issue_type}</p>
                <p style={{ margin: '8px 0' }}><strong>Location:</strong> {job.location}</p>
                <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
                  Posted {new Date(job.created_at).toLocaleString()}
                </p>
                {job.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button onClick={() => handleAcceptJob(job.id)} style={{
                      padding: '10px 20px', backgroundColor: '#4caf50', color: 'white',
                      border: 'none', borderRadius: '4px', cursor: 'pointer',
                    }}>✅ Accept Job</button>
                    <button onClick={() => handleDeclineJob(job.id)} style={{
                      padding: '10px 20px', backgroundColor: '#f44336', color: 'white',
                      border: 'none', borderRadius: '4px', cursor: 'pointer',
                    }}>❌ Decline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{
        marginTop: '60px', padding: '20px',
        backgroundColor: '#333', color: 'white',
        textAlign: 'center', borderRadius: '8px',
      }}>
        <p style={{ margin: '8px 0' }}>💰 Earn 80% of every job you complete</p>
        <p style={{ margin: '8px 0', color: '#aaa' }}>Stay active • Build reputation • Get more jobs</p>
      </footer>
    </div>
  );
}
