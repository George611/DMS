import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaGoogle, FaGithub, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const MockOAuth = () => {
    const { provider } = useParams();
    const [searchParams] = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/';
    const mode = searchParams.get('mode') || 'login';

    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const isGoogle = provider === 'google';

    const handleAuth = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Perform the mock auth action
            if (mode === 'login') {
                login(`user@${provider}.com`, 'password');
            } else {
                register({ name: `User ${provider}`, email: `user@${provider}.com` });
            }
            // Redirect back
            navigate(returnTo);
        }, 1500);
    };

    return (
        <div className="oauth-container" style={{ backgroundColor: isGoogle ? '#fff' : '#0d1117', color: isGoogle ? '#202124' : '#c9d1d9' }}>
            <div className={`oauth-card ${isGoogle ? 'google-card' : 'github-card'}`}>

                {/* Logo Section */}
                <div className="logo-section">
                    {isGoogle ? <FaGoogle className="icon google" /> : <FaGithub className="icon github" />}
                    <h1>{isGoogle ? 'Sign in with Google' : 'Sign in to GitHub'}</h1>
                </div>

                {/* Content Section */}
                <div className="content">
                    <p className="app-name">
                        to continue to <strong>Disaster Management System</strong>
                    </p>

                    <div className="user-preview">
                        <div className="avatar">JD</div>
                        <div className="user-details">
                            <p className="email">john.doe@example.com</p>
                            <p className="name">John Doe</p>
                        </div>
                    </div>

                    {!isGoogle && (
                        <div className="github-permissions">
                            <p><FaShieldAlt /> Verify your identity</p>
                            <p><FaShieldAlt /> Access public profile</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="actions">
                    <button className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
                    <button className="btn-confirm" onClick={handleAuth} disabled={isLoading}>
                        {isLoading ? 'Redirecting...' : isGoogle ? 'Continue' : 'Authorize app'}
                    </button>
                </div>
            </div>

            <style>{`
        .oauth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .oauth-card {
           width: 100%;
           max-width: 450px;
           padding: 40px;
           border-radius: 8px;
           border: 1px solid #ddd;
           box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .github-card {
            border-color: #30363d;
            background-color: #161b22;
        }

        .logo-section {
          text-align: center;
          margin-bottom: 24px;
        }
        .icon { font-size: 32px; margin-bottom: 16px; }
        .icon.google { color: #db4437; }
        .icon.github { color: #fff; }
        
        h1 { font-size: 24px; font-weight: 500; margin: 0; }

        .app-name {
          text-align: center;
          font-size: 16px;
          margin-bottom: 32px;
        }

        .user-preview {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 20px;
          border: 1px solid;
          border-color: inherit;
          margin-bottom: 32px;
          cursor: pointer;
        }
        .google-card .user-preview { border-color: #dadce0; }
        .github-card .user-preview { border-color: #30363d; background: #0d1117; }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: purple;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 14px;
        }
        .user-details p { margin: 0; }
        .user-details .email { font-weight: 500; font-size: 14px; }
        .user-details .name { font-size: 12px; opacity: 0.7; }

        .actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 48px;
        }

        .btn-cancel {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          opacity: 0.8;
        }
        .btn-confirm {
          padding: 10px 24px;
          border-radius: 4px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          color: white;
        }
        .google-card .btn-confirm { background-color: #1a73e8; }
        .github-card .btn-confirm { background-color: #238636; }

      `}</style>
        </div>
    );
};

export default MockOAuth;
