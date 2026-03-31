export default function WarningBanner() {
  return (
    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2">
        <span className="text-yellow-500 text-lg">⚠️</span>
        <div>
          <p className="font-semibold">Booking Over 90 Days Ago</p>
          <p className="text-sm mt-1">
            Your booking date is more than 90 days ago. Refund eligibility may be limited.
            Please include as much detail as possible to support your request.
          </p>
        </div>
      </div>
    </div>
  );
}
