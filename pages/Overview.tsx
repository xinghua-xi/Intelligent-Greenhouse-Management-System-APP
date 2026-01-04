import React from 'react';
import { useAppMode } from '../context/AppModeContext';
import OverviewStandard from './OverviewStandard';
import OverviewMinimal from './OverviewMinimal';
import OverviewExpert from './OverviewExpert';

const Overview: React.FC = () => {
  const { mode } = useAppMode();

  switch (mode) {
    case 'minimal':
      return <OverviewMinimal />;
    case 'expert':
      return <OverviewExpert />;
    default:
      return <OverviewStandard />;
  }
};

export default Overview;