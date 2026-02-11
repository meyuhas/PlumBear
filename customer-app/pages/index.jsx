import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-orange-500">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐻</span>
            <h1 className="text-2xl font-bold text-blue-900">PlumBear</h1>
          </div>
          <p className="text-gray-600">Local plumbers in minutes</p>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-white text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Need a Plumber Fast?</h2>
          <p className="text-xl mb-8">Get matched with local Austin plumbers instantly. No waiting, no BS.</p>

          <Link href="/book">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-bold">
              Book Now 🐻
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast Matching</h3>
            <p className="text-gray-600">Get matched with plumbers in minutes, not hours.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2">Trusted Plumbers</h3>
            <p className="text-gray-600">All plumbers rated 4.5+ stars with verified reviews.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Fair Pricing</h3>
            <p className="text-gray-600">Transparent estimates before work. No surprises.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
