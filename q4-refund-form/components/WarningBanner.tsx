export default function WarningBanner() {
  return (
    <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2">
        <span className="text-yellow-500 text-lg">⚠️</span>
        <div>
          <p className="text-sm mt-1">
            Your booking is outside the standard refund window. Your request will be reviewed on a case-by-case basis.
          </p>
        </div>
      </div>
    </div>
  );
}
