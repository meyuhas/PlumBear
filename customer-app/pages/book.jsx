import React, { useState } from 'react';
import axios from 'axios';

export default function BookPlumber() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [matchedPlumber, setMatchedPlumber] = useState(null);

  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    address: '',
    issue_type: 'clogged_drain',
    description: '',
    latitude: 30.27,
    longitude: -97.74
  });

  const issueTypes = [
    { id: 'clogged_drain', label: 'Clogged Drain', price: '$120-180' },
    { id: 'leak_detection', label: 'Leak Detection', price: '$100-150' },
    { id: 'water_heater', label: 'Water Heater', price: '$200-300' },
    { id: 'fixture_repair', label: 'Fixture Repair', price: '$150-200' },
    { id: 'pipe_replacement', label: 'Pipe Replacement', price: '$250-400' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIssueChange = (issueId) => {
    setFormData(prev => ({ ...prev, issue_type: issueId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        formData
      );

      setJobId(response.data.job_id);
      setMatchedPlumber(response.data.matched_plumber);
      setStep(2);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error booking job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐻</span>
            <h1 className="text-2xl font-bold text-blue-900">Book a Plumber</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Step 1: Booking Form */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Tell us what you need</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone & Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(512) 555-1234"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St, Austin, TX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-semibold mb-4">What's the issue?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {issueTypes.map(issue => (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => handleIssueChange(issue.id)}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        formData.issue_type === issue.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      <div className="font-semibold">{issue.label}</div>
                      <div className="text-sm text-gray-600">{issue.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Details (optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us more about the problem..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-400"
              >
                {loading ? 'Finding plumber...' : 'Find Plumber Now 🐻'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Matched Plumber */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">✅ Plumber Found!</h2>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-lg font-semibold mb-2">Job ID: {jobId}</p>
              {matchedPlumber && (
                <p className="text-lg font-semibold text-orange-600">
                  Matched with: {matchedPlumber}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">What happens next?</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Plumber gets your job details</li>
                <li>Plumber accepts job or we find another</li>
                <li>You get live updates via SMS</li>
                <li>Plumber arrives and starts work</li>
                <li>Payment processed when job done</li>
              </ol>
            </div>

            <div className="mt-8 pt-6 border-t-2">
              <p className="text-sm text-gray-600 mb-4">
                You'll receive an SMS shortly with plumber details and tracking.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
