import "./ErrorState.css";

/**
 * Error display with an optional retry action.
 * @param {string} [message]
 * @param {function} [onRetry]
 */
function ErrorState({ message = "Something went wrong. Please try again.", onRetry }) {
  return (
    <div className="error-state" role="alert">
      <span className="error-icon" aria-hidden="true">⚠️</span>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
