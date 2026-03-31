'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import WarningBanner from './WarningBanner';

interface FormData {
  full_name: string;
  email: string;
  booking_reference: string;
  booking_date: string;
  refund_reason: string;
  additional_details: string;
}

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

interface RefundFormProps {
  onSuccess: (data: SubmittedData) => void;
}

const REFUND_REASONS = ['Property Issue', 'Booking Error', 'Personal Reasons', 'Other'];

export default function RefundForm({ onSuccess }: RefundFormProps) {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    booking_reference: '',
    booking_date: '',
    refund_reason: '',
    additional_details: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));

    if (name === 'booking_date' && value) {
      const daysSince = (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24);
      setShowWarning(daysSince > 90);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.booking_reference.trim()) newErrors.booking_reference = 'Booking reference is required';
    if (!formData.booking_date) newErrors.booking_date = 'Booking date is required';
    if (!formData.refund_reason) newErrors.refund_reason = 'Please select a refund reason';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);

      const res = await fetch('/api/submit', { method: 'POST', body: fd });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || 'Submission failed. Please try again.');
        return;
      }

      onSuccess(json.data);
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {showWarning && <WarningBanner />}

      {serverError && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
          {serverError}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.full_name ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Jane Doe"
        />
        {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="jane@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Booking Reference */}
      <div>
        <label htmlFor="booking_reference" className="block text-sm font-medium text-gray-700 mb-1">
          Booking Reference <span className="text-red-500">*</span>
        </label>
        <input
          id="booking_reference"
          name="booking_reference"
          type="text"
          value={formData.booking_reference}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.booking_reference ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="BK-12345"
        />
        {errors.booking_reference && <p className="text-red-500 text-xs mt-1">{errors.booking_reference}</p>}
      </div>

      {/* Booking Date */}
      <div>
        <label htmlFor="booking_date" className="block text-sm font-medium text-gray-700 mb-1">
          Booking Date <span className="text-red-500">*</span>
        </label>
        <input
          id="booking_date"
          name="booking_date"
          type="date"
          value={formData.booking_date}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.booking_date ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.booking_date && <p className="text-red-500 text-xs mt-1">{errors.booking_date}</p>}
      </div>

      {/* Refund Reason */}
      <div>
        <label htmlFor="refund_reason" className="block text-sm font-medium text-gray-700 mb-1">
          Refund Reason <span className="text-red-500">*</span>
        </label>
        <select
          id="refund_reason"
          name="refund_reason"
          value={formData.refund_reason}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.refund_reason ? 'border-red-400' : 'border-gray-300'}`}
        >
          <option value="">Select a reason...</option>
          {REFUND_REASONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {errors.refund_reason && <p className="text-red-500 text-xs mt-1">{errors.refund_reason}</p>}
      </div>

      {/* Additional Details */}
      <div>
        <label htmlFor="additional_details" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Details
        </label>
        <textarea
          id="additional_details"
          name="additional_details"
          value={formData.additional_details}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Please provide any additional context..."
        />
      </div>

      {/* File Upload */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
          Supporting Document <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="file"
          name="file"
          type="file"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
      >
        {submitting ? 'Submitting...' : 'Submit Refund Request'}
      </button>
    </form>
  );
}
