import { useAlerts } from '../../context/AlertContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire, FaBriefcaseMedical, FaHardHat, FaClock } from 'react-icons/fa';

const LiveIncidentFeed = () => {
    const { t } = useLanguage();
    const { alerts: incidents } = useAlerts();

    const getTypeIcon = (type) => {
        switch (type) {
            case 'fire': return <FaFire className="text-orange-500" />;
            case 'medical': return <FaBriefcaseMedical className="text-red-500" />;
            case 'infrastructure': return <FaHardHat className="text-yellow-500" />;
            default: return <FaClock className="text-blue-500" />;
        }
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    {t('liveIncidentFeed')}
                </h3>
                <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">{t('realTimeAwareness')}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {incidents.length === 0 ? (
                        <div className="text-center py-10 text-white/20 italic">{t('noIncidentsReported')}</div>
                    ) : (
                        incidents.slice(0, 10).map((incident) => (
                            <motion.div
                                key={incident.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-white/5 border border-white/5 hover:border-white/20 p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer group"
                            >
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors mt-1">
                                    {getTypeIcon(incident.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm text-white/90 truncate mr-2">{incident.title}</h4>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold ${incident.severity === 'high' ? 'bg-red-500/20 text-red-500' :
                                                incident.severity === 'medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {t(incident.severity)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/50 line-clamp-1 mb-2">{incident.location}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-white/30">{new Date(incident.createdAt || incident.created_at).toLocaleTimeString()}</span>
                                        <span className={`text-[10px] font-semibold flex items-center gap-1 ${incident.status === 'reported' ? 'text-white/40' :
                                                incident.status === 'in-progress' ? 'text-amber-400' : 'text-green-400'
                                            }`}>
                                            <span className={`w-1 h-1 rounded-full ${incident.status === 'reported' ? 'bg-white/40' :
                                                    incident.status === 'in-progress' ? 'bg-amber-400' : 'bg-green-400'
                                                }`}></span>
                                            {t(incident.status)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LiveIncidentFeed;
