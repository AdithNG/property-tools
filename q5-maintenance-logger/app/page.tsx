'use client';

import { useState } from 'react';
import SubmitForm from '@/components/SubmitForm';
import Dashboard from '@/components/Dashboard';

type Tab = 'submit' | 'dashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('submit');
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSubmitSuccess() {
    setRefreshKey(k => k + 1);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Issue Logger</h1>
          <p className="text-sm text-gray-500 mt-1">Log and track property maintenance issues.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === 'submit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Submit Issue
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'submit' ? (
            <SubmitForm onSubmitSuccess={handleSubmitSuccess} />
          ) : (
            <Dashboard refreshKey={refreshKey} />
          )}
        </div>
      </div>
    </main>
  );
}
