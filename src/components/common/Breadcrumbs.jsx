import { useLocation, Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

const Breadcrumbs = () => {
    const { t, language } = useLanguage();
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Skip breadcrumbs on home/dashboard root if desired, or customize mapping
    const routeMap = {
        'app': null, // Don't show 'app' in breadcrumb
        'dashboard': t('dashboard'),
        'disasters': t('disasterManagement'),
        'alerts': t('alerts'),
        'command': t('command'),
        'logistics': t('logistics'),
        'audits': t('audits'),
        'resources': t('resources'),
        'sos': 'SOS',
        'report': t('reportIssue')
    };

    return (
        <nav aria-label="breadcrumb" className="breadcrumb-nav mb-4">
            <ol className="flex items-center gap-2 text-sm text-secondary">
                {/* Removed Home Icon from here */}
                {pathnames.map((value, index) => {
                    if (routeMap[value] === null) return null; // Skip hidden segments
                    const name = routeMap[value] || value;

                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                        <li key={to} className="flex items-center gap-2">
                            <FaChevronRight className={`${language === 'ar' ? 'rotate-180' : ''} text-xs text-muted`} />
                            {isLast ? (
                                <span className="font-semibold text-text-main capitalize">{name}</span>
                            ) : (
                                <Link to={to} className="hover:text-primary transition-colors capitalize">
                                    {name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
