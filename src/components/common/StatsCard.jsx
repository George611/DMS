const StatsCard = ({ title, value, icon, color, trend }) => {
    return (
        <div className="stats-card">
            <div className="stats-icon" style={{ backgroundColor: `var(--${color}-light)`, color: `var(--${color})` }}>
                {icon}
            </div>
            <div className="stats-info">
                <h3 className="stats-title">{title}</h3>
                <p className="stats-value">{value}</p>
                {trend && <span className="stats-trend">{trend}</span>}
            </div>

            <style>{`
        .stats-card {
          background: var(--bg-surface);
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
        }
        .stats-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .stats-title {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }
        .stats-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1;
        }
        .stats-trend {
          font-size: 0.75rem;
          color: var(--success);
          margin-top: 0.25rem;
          display: inline-block;
        }
      `}</style>
        </div >
    );
};

export default StatsCard;
