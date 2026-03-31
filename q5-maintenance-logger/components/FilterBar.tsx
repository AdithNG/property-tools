'use client';

const PROPERTIES = ['Sunset Villa', 'Ocean Breeze Apt', 'Mountain Lodge', 'City Center Suite', 'Harbor View Condo'];
const URGENCIES = ['Low', 'Medium', 'High'];

interface FilterBarProps {
  property: string;
  urgency: string;
  onPropertyChange: (v: string) => void;
  onUrgencyChange: (v: string) => void;
}

export default function FilterBar({ property, urgency, onPropertyChange, onUrgencyChange }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">Filter by Property</label>
        <select
          value={property}
          onChange={e => onPropertyChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Properties</option>
          {PROPERTIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 mb-1">Filter by Urgency</label>
        <select
          value={urgency}
          onChange={e => onUrgencyChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Urgencies</option>
          {URGENCIES.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      {(property || urgency) && (
        <div className="flex items-end">
          <button
            onClick={() => { onPropertyChange(''); onUrgencyChange(''); }}
            className="text-xs text-blue-600 hover:underline py-2 px-3 border border-blue-200 rounded-lg"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
