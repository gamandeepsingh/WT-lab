import React from 'react';
import Marquee from 'react-fast-marquee';

const MarqueeSection = () => {
  return (
    <div className="bg-black dark:text-black dark:bg-primary h-8">
      <Marquee gradient={false} speed={20}>
        <span className="text-xs text-white dark:text-black mx-10">Do not feel the FOMO</span>
        <span className="text-xs text-white dark:text-black mx-10">Do not feel the FOMO</span>
        <span className="text-xs text-white dark:text-black mx-10">Do not feel the FOMO</span>
        <span className="text-xs text-white dark:text-black mx-10">Do not feel the FOMO</span>
        <span className="text-xs text-white dark:text-black mx-10">Do not feel the FOMO</span>
        <span className="text-xs text-white dark:text-black mx-10">Do not feel the FOMO</span>
        <span className="text-xs text-white dark:text-black mx-10">Do not feel the FOMO</span>
        <span className="text-xs text-white dark:text-black mx-10">Do not feel the FOMO</span>
      </Marquee>
    </div>
  );
};

export default MarqueeSection;
