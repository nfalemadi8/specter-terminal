export default function Panel({ title, children, className = '' }) {
  return (
    <section className={`bb-panel flex flex-col min-w-0 ${className}`} aria-label={title || undefined}>
      {title && <div className="bb-panel-header" aria-hidden="true">{title}</div>}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-2">
        {children}
      </div>
    </section>
  );
}
