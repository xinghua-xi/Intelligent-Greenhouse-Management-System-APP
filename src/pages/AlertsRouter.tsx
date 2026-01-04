import React from 'react';
import { useAppMode } from '../context/AppModeContext';
import AlertsPage from './Alerts';
import AlertsMinimal from './AlertsMinimal';
import AlertsExpert from './AlertsExpert';

const AlertsRouter: React.FC = () => {
  const { mode } = useAppMode();

  switch (mode) {
    case 'minimal':
      return <AlertsMinimal />;
    case 'expert':
      return <AlertsExpert />;
    default:
      return <AlertsPage />;
  }
};

export default AlertsRouter;
