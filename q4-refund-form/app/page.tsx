'use client';

import { useState } from 'react';
import RefundForm from '@/components/RefundForm';
import SuccessView from '@/components/SuccessView';

interface SubmittedData {
  id: number;
  full_name: string;
  email: string;
  booking_reference: string;
  booking_date: string;
  refund_reason: string;
  additional_details: string | null;
  file_name: string | null;
  created_at: string;
}

export default function Home() {
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Guest Refund Request</h1>
          <p className="text-sm text-gray-500 mt-1">Fill out the form below to submit a refund request.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {submittedData ? (
            <SuccessView data={submittedData} onReset={() => setSubmittedData(null)} />
          ) : (
            <RefundForm onSuccess={setSubmittedData} />
          )}
        </div>
      </div>
    </main>
  );
}
