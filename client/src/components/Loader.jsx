import React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    1: '#0ea5e9',
  },
});

const Loader = () => {
  return <TopBarProgress />;
};

export default Loader;
