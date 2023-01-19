import React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    1: '#3b82f6',
  },
});

const Loader = () => {
  return <TopBarProgress />;
};

export default Loader;
