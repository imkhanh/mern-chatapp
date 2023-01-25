import React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    0: '#5BC0F8',
    1: '#0081C9',
  },
});

const Loader = () => {
  return <TopBarProgress />;
};

export default Loader;
