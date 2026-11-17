import "./EmptyState.css";

/**
 * Empty / zero-results display.
 * @param {string} [title]
 * @param {string} [message]
 * @param {React.ReactNode} [action]  — optional CTA element
 */
function EmptyState({
  title = "Nothing here yet",
  message = "No results to display.",
  action,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">📚</span>
      <h2 className="empty-title">{title}</h2>
      <p className="empty-message">{message}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}

export default EmptyState;
