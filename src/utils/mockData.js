export const MOCK_USER = {
    id: 'u1',
    name: 'Alex Commander',
    role: 'authority', // 'authority', 'volunteer', 'citizen'
    email: 'alex@dms.gov'
};

export const ALERTS = [
    { id: 1, type: 'critical', titleKey: 'flashFloodWarning', locationKey: 'districtA', customLocation: '33.8938, 35.5018', timeKey: 'tenMinsAgo' }, // Beirut
    { id: 2, type: 'warning', titleKey: 'heavyRainfall', locationKey: 'districtB', customLocation: '34.4367, 35.8497', timeKey: 'oneHourAgo' }, // Tripoli
    { id: 3, type: 'info', titleKey: 'roadClosure', locationKey: 'highway42', customLocation: '33.5613, 35.3731', timeKey: 'twoHoursAgo' }, // Sidon
    { id: 4, type: 'critical', titleKey: 'wildfireReported', locationKey: 'northForest', customLocation: '33.8547, 35.8623', timeKey: 'fiveMinsAgo' } // Zahle
];
