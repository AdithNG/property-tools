'use client';

import { useState, useEffect, useCallback } from 'react';
import FilterBar from './FilterBar';
import IssueRow from './IssueRow';

interface Issue {
  id: number;
  ticket_number: string;
  property_name: string;
  category: string;
  urgency: string;
  description: string;
  photo_name: string | null;
  status: string;
  created_at: string;
}

interface DashboardProps {
  refreshKey: number;
}

export default function Dashboard({ refreshKey }: DashboardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState('');
  const [urgency, setUrgency] = useState('');

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (property) params.set('property', property);
      if (urgency) params.set('urgency', urgency);
      const res = await fetch(`/api/issues?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      setIssues(json.issues);
    } catch {
      setError('Failed to load issues. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [property, urgency]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues, refreshKey]);

  return (
    <div>
      <FilterBar
        property={property}
        urgency={urgency}
        onPropertyChange={setProperty}
        onUrgencyChange={setUrgency}
      />

      {loading && (
        <div className="text-center py-10 text-gray-400 text-sm">Loading issues...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>
      )}

      {!loading && !error && issues.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">No issues found.</div>
      )}

      {!loading && !error && issues.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Ticket #</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
