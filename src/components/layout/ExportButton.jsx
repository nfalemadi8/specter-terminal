import { exportToCSV } from '../../utils/exportCsv';

export default function ExportButton({ data, filename, label = 'CSV' }) {
  if (!data || !data.length) return null;
  return (
    <button
      onClick={() => exportToCSV(data, filename)}
      className="px-1.5 py-0.5 text-[8px] border border-bb-border text-bb-muted hover:text-bb-amber hover:border-bb-amber"
    >
      EXPORT {label}
    </button>
  );
}
