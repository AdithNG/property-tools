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

interface SuccessViewProps {
  data: SubmittedData;
  onReset: () => void;
}

export default function SuccessView({ data, onReset }: SuccessViewProps) {
  const rows: { label: string; value: string | null }[] = [
    { label: 'Reference ID', value: `#${data.id}` },
    { label: 'Full Name', value: data.full_name },
    { label: 'Email', value: data.email },
    { label: 'Booking Reference', value: data.booking_reference },
    { label: 'Booking Date', value: data.booking_date },
    { label: 'Refund Reason', value: data.refund_reason },
    { label: 'Additional Details', value: data.additional_details || '—' },
    { label: 'Attachment', value: data.file_name || 'None' },
    { label: 'Submitted At', value: new Date(data.created_at + ' UTC').toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-300 text-green-800 rounded-lg p-4 flex items-start gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-semibold text-lg">Request Submitted Successfully</p>
          <p className="text-sm mt-1">Your refund request has been received and logged. Please keep your reference ID for follow-up.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Submission Summary</h2>
        </div>
        <dl className="divide-y divide-gray-100">
          {rows.map(({ label, value }) => (
            <div key={label} className="px-4 py-3 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">{label}</dt>
              <dd className="text-sm text-gray-900 mt-0.5 sm:mt-0 break-words">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        onClick={onReset}
        className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
      >
        Submit Another Request
      </button>
    </div>
  );
}
