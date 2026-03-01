export default function Panel({ title, children, className = '' }) {
  return (
    <div className={`bb-panel flex flex-col min-w-0 ${className}`}>
      {title && <div className="bb-panel-header">{title}</div>}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-2">
        {children}
      </div>
    </div>
  );
}
