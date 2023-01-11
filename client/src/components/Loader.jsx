import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
  barColors: {
    1: '#0081C9',
  },
  shadowBlur: 0,
});

const Loader = () => {
  return <TopBarProgress />;
};

export default Loader;
