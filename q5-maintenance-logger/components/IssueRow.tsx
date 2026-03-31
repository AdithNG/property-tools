'use client';

import { useState } from 'react';

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

const urgencyColors: Record<string, string> = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

const STATUSES = ['Open', 'In Progress', 'Resolved'];

interface IssueRowProps {
  issue: Issue;
}

export default function IssueRow({ issue }: IssueRowProps) {
  const [status, setStatus] = useState(issue.status);
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/issues/${issue.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm font-mono font-medium text-blue-700 whitespace-nowrap">
        {issue.ticket_number}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{issue.property_name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{issue.category}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyColors[issue.urgency] ?? 'bg-gray-100 text-gray-700'}`}>
          {issue.urgency}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
        {new Date(issue.created_at + ' UTC').toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <select
          value={status}
          onChange={e => handleStatusChange(e.target.value)}
          disabled={saving}
          className={`text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            status === 'Resolved' ? 'border-green-300 bg-green-50 text-green-800' :
            status === 'In Progress' ? 'border-yellow-300 bg-yellow-50 text-yellow-800' :
            'border-gray-300 bg-white text-gray-700'
          } ${saving ? 'opacity-50' : ''}`}
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
    </tr>
  );
}
