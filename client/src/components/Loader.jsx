import React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    0: '#60a5fa',
    0.5: '#3b82f6',
    1: '#2563eb',
  },
});

const Loader = () => {
  return <TopBarProgress />;
};

export default Loader;
