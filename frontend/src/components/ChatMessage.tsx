import type { ChatMessage as ChatMessageType, MatterSummary } from '../types';

function SummaryCard({ summary }: { summary: MatterSummary }) {
  return (
    <div className="summary-card">
      <h3 className="summary-title">{summary.title}</h3>

      <section className="summary-section">
        <h4>Executive Summary</h4>
        <p>{summary.executiveSummary}</p>
      </section>

      {summary.partiesInvolved.length > 0 && (
        <section className="summary-section">
          <h4>Parties Involved</h4>
          <ul>
            {summary.partiesInvolved.map((party, i) => (
              <li key={i}>{party}</li>
            ))}
          </ul>
        </section>
      )}

      {summary.importantDates.length > 0 && (
        <section className="summary-section">
          <h4>Important Dates</h4>
          <ul>
            {summary.importantDates.map((d, i) => (
              <li key={i}>
                <strong>{d.date}</strong>: {d.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {summary.keyFacts.length > 0 && (
        <section className="summary-section">
          <h4>Key Facts</h4>
          <ul>
            {summary.keyFacts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </section>
      )}

      {summary.issuesOrClaims.length > 0 && (
        <section className="summary-section">
          <h4>Issues / Claims</h4>
          <ul>
            {summary.issuesOrClaims.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </section>
      )}

      {summary.requestedActions.length > 0 && (
        <section className="summary-section">
          <h4>Requested Actions / Next Steps</h4>
          <ul>
            {summary.requestedActions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </section>
      )}

      {summary.risksAndMissingInfo.length > 0 && (
        <section className="summary-section">
          <h4>Risks / Missing Information</h4>
          <ul>
            {summary.risksAndMissingInfo.map((risk, i) => (
              <li key={i}>{risk}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="summary-section">
        <h4>Final Summary</h4>
        <p>{summary.finalSummary}</p>
      </section>
    </div>
  );
}

export default function ChatMessageComponent({
  message,
}: {
  message: ChatMessageType;
}) {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-avatar">
        {message.role === 'user' ? '👤' : '🤖'}
      </div>
      <div className="message-body">
        <div className="message-content">
          {message.summary ? (
            <SummaryCard summary={message.summary} />
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
          )}
        </div>
        <span className="message-time">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
