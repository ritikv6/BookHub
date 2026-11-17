import "./LoadingState.css";

/**
 * Full-width loading spinner + label.
 * @param {string} [message] – optional override text
 */
function LoadingState({ message = "Loading…" }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default LoadingState;
