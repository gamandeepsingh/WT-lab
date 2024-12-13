import React, { useEffect } from 'react';

const Confetti = ({ children }) => {
  useEffect(() => {
    const confetti = () => {
      document.querySelectorAll(".particletext.confetti").forEach(element => {
        const confettiCount = (element.offsetWidth / 50) * 0.5; // Reduced confetti count
        for (let i = 0; i <= confettiCount; i++) {
          const particle = document.createElement('span');
          particle.className = `particle c${rnd(1, 2)}`;
          particle.style.top = `${rnd(10, 50)}%`;
          particle.style.left = `${rnd(0, 100)}%`;
          particle.style.width = `${rnd(6, 8)}px`;
          particle.style.height = `${rnd(3, 4)}px`;
          particle.style.animationDelay = `${rnd(0, 30) / 10}s`;
          element.appendChild(particle);
        }
      });
    }

    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    confetti();
  }, []);

  return (
    <div className="py-2 flex items-center justify-center md:justify-start">
      <hr className='border-gray-600 absolute w-11/12' />
      <h2 className="particletext px-3 md:px-0 bg-white dark:bg-black md:pr-4 text-lg md:text-2xl confetti relative">
        {children}
      </h2>
    </div>
  );
}

export default Confetti;
