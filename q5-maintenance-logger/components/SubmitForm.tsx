'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

const PROPERTIES = ['Sunset Villa', 'Ocean Breeze Apt', 'Mountain Lodge', 'City Center Suite', 'Harbor View Condo'];
const CATEGORIES = ['Plumbing', 'Electrical', 'AC/HVAC', 'Furniture', 'Cleaning', 'Other'];
const URGENCIES = ['Low', 'Medium', 'High'] as const;

interface FormFields {
  property_name: string;
  category: string;
  urgency: string;
  description: string;
}

interface SubmitFormProps {
  onSubmitSuccess: () => void;
}

export default function SubmitForm({ onSubmitSuccess }: SubmitFormProps) {
  const [fields, setFields] = useState<FormFields>({
    property_name: '',
    category: '',
    urgency: '',
    description: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<FormFields> = {};
    if (!fields.property_name) errs.property_name = 'Select a property';
    if (!fields.category) errs.category = 'Select a category';
    if (!fields.urgency) errs.urgency = 'Select urgency level';
    if (!fields.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const fd = new FormData();
      Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);

      const res = await fetch('/api/issues', { method: 'POST', body: fd });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || 'Submission failed. Please try again.');
        return;
      }

      setTicketNumber(json.data.ticket_number);
      onSubmitSuccess();
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setFields({ property_name: '', category: '', urgency: '', description: '' });
    setPhoto(null);
    setErrors({});
    setTicketNumber(null);
    setServerError(null);
  }

  if (ticketNumber) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-300 rounded-lg p-5 text-center">
          <div className="text-4xl mb-2">✅</div>
          <h2 className="text-lg font-semibold text-green-800">Issue Logged</h2>
          <p className="text-sm text-green-700 mt-1">Your ticket number is:</p>
          <p className="text-2xl font-mono font-bold text-green-900 mt-2">{ticketNumber}</p>
          <p className="text-xs text-green-600 mt-2">Keep this number for tracking your issue.</p>
        </div>
        <button
          onClick={handleReset}
          className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          Submit Another Issue
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
          {serverError}
        </div>
      )}

      {/* Property */}
      <div>
        <label htmlFor="property_name" className="block text-sm font-medium text-gray-700 mb-1">
          Property <span className="text-red-500">*</span>
        </label>
        <select
          id="property_name"
          name="property_name"
          value={fields.property_name}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.property_name ? 'border-red-400' : 'border-gray-300'}`}
        >
          <option value="">Select a property...</option>
          {PROPERTIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.property_name && <p className="text-red-500 text-xs mt-1">{errors.property_name}</p>}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Issue Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={fields.category}
          onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-400' : 'border-gray-300'}`}
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Urgency <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {URGENCIES.map(u => (
            <label key={u} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="urgency"
                value={u}
                checked={fields.urgency === u}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                u === 'Low' ? 'bg-green-100 text-green-800' :
                u === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>{u}</span>
            </label>
          ))}
        </div>
        {errors.urgency && <p className="text-red-500 text-xs mt-1">{errors.urgency}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={fields.description}
          onChange={handleChange}
          rows={4}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Describe the issue in detail..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Photo Upload */}
      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
          Photo <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={e => setPhoto(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
      >
        {submitting ? 'Submitting...' : 'Log Issue'}
      </button>
    </form>
  );
}
