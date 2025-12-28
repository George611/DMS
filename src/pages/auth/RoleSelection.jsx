import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserShield, FaHandsHelping, FaUser } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const RoleSelection = () => {
  const { t } = useLanguage();
  const { switchRole } = useAuth(); // We need to add this to context
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Navigate to login with the selected role
    navigate('/login', { state: { role } });
  };

  return (
    <div className="role-container">
      <div className="role-content animate-fade-in">
        <div className="text-center mb-12">
          <h1>{t('selectAccess')}</h1>
          <p className="mx-auto">{t('roleInstruction')}</p>
        </div>

        <div className="role-grid">
          <button onClick={() => handleRoleSelect('authority')} className="role-card authority">
            <div className="icon-wrapper"><FaUserShield /></div>
            <div className="role-text">
              <h3>{t('authority')}</h3>
              <p>{t('authorityDesc')}</p>
            </div>
          </button>

          <button onClick={() => handleRoleSelect('volunteer')} className="role-card volunteer">
            <div className="icon-wrapper"><FaHandsHelping /></div>
            <div className="role-text">
              <h3>{t('volunteer')}</h3>
              <p>{t('volunteerDesc')}</p>
            </div>
          </button>

          <button onClick={() => handleRoleSelect('citizen')} className="role-card citizen">
            <div className="icon-wrapper"><FaUser /></div>
            <div className="role-text">
              <h3>{t('citizen')}</h3>
              <p>{t('citizenDesc')}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="bg-glow"></div>
      <div className="decor-circle c1"></div>
      <div className="decor-circle c2"></div>

      <style>{`
        .role-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background-color: var(--bg-body);
        }
        
        .role-content {
          width: 100%;
          max-width: 1000px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .role-content h1 { 
          margin-bottom: 0.5rem; 
          font-size: 2.25rem;
          font-weight: 800;
        }
        .role-content p { 
          color: var(--text-secondary); 
          margin-bottom: 3.5rem; 
          font-size: 1.1rem;
          max-width: 600px;
        }
        
        .role-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: stretch;
          gap: 2rem;
          width: 100%;
        }

        @media (max-width: 768px) {
          .role-grid {
             gap: 1.25rem;
          }
          .role-content h1 { font-size: 1.75rem; }
          .role-content p { margin-bottom: 2.5rem; }
        }
        
        .role-card {
          background: var(--bg-surface);
          padding: 2.5rem 2rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          width: 100%;
          max-width: 300px;
          flex: 1 1 280px;
          cursor: pointer;
        }
        
        .role-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary);
        }
        
        .icon-wrapper {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          background: var(--bg-surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.25rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          transition: transform 0.3s ease;
        }
        
        .role-card:hover .icon-wrapper {
          transform: scale(1.1);
        }
        
        .role-card.authority .icon-wrapper { color: var(--primary); background: rgba(59, 130, 246, 0.1); }
        .role-card.volunteer .icon-wrapper { color: var(--success); background: rgba(16, 185, 129, 0.1); }
        .role-card.citizen .icon-wrapper { color: var(--info); background: rgba(59, 130, 246, 0.1); }
        
        .role-card h3 { font-size: 1.35rem; font-weight: 700; margin: 0; color: var(--text-main); }
        .role-card p { font-size: 0.95rem; color: var(--text-secondary); margin: 0; line-height: 1.4; }

        .text-center { text-align: center; }
        .mb-12 { margin-bottom: 3rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }

        /* Decor */
        .role-container { position: relative; overflow: hidden; }
        .bg-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
          opacity: 0.05;
          pointer-events: none;
          z-index: 1;
        }
        .decor-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.1;
          z-index: 1;
          pointer-events: none;
        }
        .c1 { width: 400px; height: 400px; top: -100px; right: -100px; background: var(--primary); }
        .c2 { width: 300px; height: 300px; bottom: -50px; left: -50px; background: var(--success); }
        .role-content { position: relative; z-index: 2; }
      `}</style>
    </div>
  );
};

export default RoleSelection;
