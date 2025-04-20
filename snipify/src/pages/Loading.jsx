import React from 'react';
import MobileWrapper from '../components/MobileWrapper';

const Loading = () => {
  return (
    <MobileWrapper>
        <div className="text-3xl mb-4">Loading...</div>
        <span className="loading loading-dots loading-xl"></span>
    </MobileWrapper>
  );
};

export default Loading;
