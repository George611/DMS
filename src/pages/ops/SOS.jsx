import { useState } from 'react';
import { FaBroadcastTower, FaMapMarkerAlt } from 'react-icons/fa';

const SOS = () => {
    const [active, setActive] = useState(false);

    const handleSOS = () => {
        setActive(true);
        // Logic to send SOS
        setTimeout(() => {
            alert("SOS Signal Broadcasted to all nearby Authorities!");
        }, 1000);
    };

    return (
        <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
            {!active ? (
                <>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-danger mb-2">Emergency SOS</h2>
                        <p className="text-secondary max-w-md mx-auto">
                            Press the button below only in case of extreme emergency. This will share your live location with rescue teams.
                        </p>
                    </div>

                    <button
                        onClick={handleSOS}
                        className="sos-btn"
                    >
                        SOS
                    </button>
                </>
            ) : (
                <div className="active-state">
                    <div className="pulse-ring"></div>
                    <FaBroadcastTower className="text-5xl text-danger mb-4 mx-auto animate-pulse" />
                    <h2 className="text-2xl font-bold text-danger">SOS Signal Active</h2>
                    <p className="text-main mb-6">Broadcasting location...</p>

                    <div className="info-card bg-surface p-4 rounded-lg border border-border text-left max-w-sm mx-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <FaMapMarkerAlt className="text-primary" />
                            <span className="font-bold">Locating...</span>
                        </div>
                        <p className="text-sm text-secondary">
                            Responders have been notified. Stay calm and stay put if safe.
                        </p>
                    </div>

                    <button
                        onClick={() => setActive(false)}
                        className="mt-8 text-secondary hover:text-main underline"
                    >
                        Cancel SOS
                    </button>
                </div>
            )}

            <style>{`
        .sos-btn {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
          color: white;
          font-size: 3rem;
          font-weight: 900;
          border: 8px solid #fecaca;
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          animation: pulse-red 2s infinite;
          transition: transform 0.1s;
        }
        .sos-btn:active {
          transform: scale(0.95);
        }
        
        @keyframes pulse-red {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
        </div>
    );
};

export default SOS;
