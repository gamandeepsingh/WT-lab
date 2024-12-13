import React, { useEffect } from 'react';

const Blob = () => {
  useEffect(() => {
    const cursor = document.querySelector('.blob');
    const handleMouseMove = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    // Set initial position to top: 0, left: 0
    cursor.style.transform = 'translate3d(0px, 0px, 0)';

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="container flex justify-center items-center w-full relative">
      <div
        className="blob fixed pointer-events-none"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '100%',
          backgroundImage: 'linear-gradient(135deg, #b5d300 30%, #FFFFFF 100%)',
          filter: 'blur(150px)',
          transition: 'all 450ms ease-out',
          left: '-150px',
          top: '-150px',
          zIndex: '0',
        }}
      ></div>
    </div>
  );
};

export default Blob;
