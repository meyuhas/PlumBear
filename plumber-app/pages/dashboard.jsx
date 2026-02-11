import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PlumberDashboard() {
  const [plumber, setPlumber] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlumberData();
    // Poll for new jobs every 10 seconds
    const interval = setInterval(loadPlumberData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadPlumberData = async () => {
    try {
      // Get plumber ID from localStorage (set during login)
      const plumberId = localStorage.getItem('plumberId');
      if (!plumberId) {
        window.location.href = '/plumber/login';
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plumbers/${plumberId}`
      );
      setPlumber(response.data);

      // Get plumber's jobs
      const jobsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plumbers/${plumberId}/jobs`
      );
      setJobs(jobsResponse.data);
    } catch (error) {
      console.error('Error loading plumber data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
        { status: 'accepted' }
      );
      setActiveJob(jobId);
      loadPlumberData();
    } catch (error) {
      console.error('Error accepting job:', error);
      alert('Failed to accept job');
    }
  };

  const handleDeclineJob = async (jobId) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
        { status: 'declined' }
      );
      loadPlumberData();
    } catch (error) {
      console.error('Error declining job:', error);
    }
  };

  const handleCompleteJob = async (jobId, finalPrice) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}`,
        { status: 'completed', final_price: finalPrice }
      );
      setActiveJob(null);
      loadPlumberData();
    } catch (error) {
      console.error('Error completing job:', error);
      alert('Failed to complete job');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🐻</span>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">PlumBear Plumber</h1>
                {plumber && (
                  <p className="text-gray-600">Welcome, {plumber.name}</p>
                )}
              </div>
            </div>
            {plumber && (
              <div className="text-right">
                <p className="text-lg font-bold">{plumber.rating.toFixed(1)} ⭐</p>
                <p className="text-sm text-gray-600">{plumber.total_jobs} jobs</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Active Job */}
        {activeJob && (
          <div className="mb-8 bg-orange-50 border-2 border-orange-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🔧 CURRENT JOB</h2>
            {jobs.find(j => j.id === activeJob) && (
              <JobDetails
                job={jobs.find(j => j.id === activeJob)}
                onComplete={handleCompleteJob}
              />
            )}
          </div>
        )}

        {/* Available Jobs */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Available Jobs ({jobs.filter(j => j.status === 'pending').length})
          </h2>

          {jobs.filter(j => j.status === 'pending').length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg">No jobs available right now</p>
              <p className="text-gray-500">Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.filter(j => j.status === 'pending').map(job => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold capitalize">
                        {job.issue_type.replace('_', ' ')}
                      </h3>
                      <p className="text-gray-600">{job.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        ${job.estimated_price}
                      </p>
                      <p className="text-sm text-gray-600">estimated</p>
                    </div>
                  </div>

                  {job.description && (
                    <p className="text-gray-700 mb-4">{job.description}</p>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAcceptJob(job.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
                    >
                      ✅ ACCEPT
                    </button>
                    <button
                      onClick={() => handleDeclineJob(job.id)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg"
                    >
                      DECLINE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Jobs */}
        {jobs.filter(j => j.status === 'completed').length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">
              Completed ({jobs.filter(j => j.status === 'completed').length})
            </h2>
            <div className="grid gap-4">
              {jobs.filter(j => j.status === 'completed').slice(0, 5).map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow p-4">
                  <p className="font-semibold capitalize">{job.issue_type.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600">${job.final_price || job.estimated_price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function JobDetails({ job, onComplete }) {
  const [status, setStatus] = useState(job.status);
  const [finalPrice, setFinalPrice] = useState(job.estimated_price);
  const [showComplete, setShowComplete] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">{job.address}</h3>
        <p className="text-gray-700">{job.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded">
          <p className="text-sm text-gray-600">Issue</p>
          <p className="text-lg font-bold capitalize">{job.issue_type.replace('_', ' ')}</p>
        </div>
        <div className="bg-white p-4 rounded">
          <p className="text-sm text-gray-600">Estimate</p>
          <p className="text-lg font-bold">${job.estimated_price}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="text-sm font-semibold">Final Price</span>
          <input
            type="number"
            value={finalPrice}
            onChange={(e) => setFinalPrice(parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStatus('started')}
          className={`flex-1 py-2 rounded font-bold ${
            status === 'started'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          Started Work
        </button>
        <button
          onClick={() => setShowComplete(true)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
        >
          Complete Job ✅
        </button>
      </div>

      {showComplete && (
        <div className="bg-blue-50 p-4 rounded border border-blue-300">
          <p className="text-sm mb-4">
            Ready to mark job complete? You'll get paid ${finalPrice} (80% = ${Math.round(finalPrice * 0.8)})
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onComplete(job.id, finalPrice)}
              className="flex-1 bg-green-600 text-white font-bold py-2 rounded"
            >
              Yes, Complete!
            </button>
            <button
              onClick={() => setShowComplete(false)}
              className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
