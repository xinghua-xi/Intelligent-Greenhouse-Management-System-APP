import React from 'react';
import { useAppMode } from '../context/AppModeContext';
import GreenhousePage from './Greenhouse';
import GreenhouseMinimal from './GreenhouseMinimal';
import GreenhouseExpert from './GreenhouseExpert';

const GreenhouseRouter: React.FC = () => {
  const { mode } = useAppMode();

  switch (mode) {
    case 'minimal':
      return <GreenhouseMinimal />;
    case 'expert':
      return <GreenhouseExpert />;
    default:
      return <GreenhousePage />;
  }
};

export default GreenhouseRouter;
