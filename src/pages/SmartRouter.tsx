import React from 'react';
import { useAppMode } from '../context/AppModeContext';
import SmartPage from './Smart';
import SmartMinimal from './SmartMinimal';
import SmartExpert from './SmartExpert';

const SmartRouter: React.FC = () => {
  const { mode } = useAppMode();

  switch (mode) {
    case 'minimal':
      return <SmartMinimal />;
    case 'expert':
      return <SmartExpert />;
    default:
      return <SmartPage />;
  }
};

export default SmartRouter;
