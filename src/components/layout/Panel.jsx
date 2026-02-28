export default function Panel({ title, children, className = '' }) {
  return (
    <div className={`bb-panel flex flex-col ${className}`}>
      {title && <div className="bb-panel-header">{title}</div>}
      <div className="flex-1 overflow-auto p-2">
        {children}
      </div>
    </div>
  );
}
