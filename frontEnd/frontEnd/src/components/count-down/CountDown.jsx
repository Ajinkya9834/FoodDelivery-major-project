import React, { useState, useEffect } from 'react';

function CountDown({ initialSeconds }) { 
  const [countDown, setCountDown] = useState(initialSeconds);

  function formatTime(seconds)  {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0'); // calculate hours
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'); // calculate minutes
    const sec = String(seconds % 60).padStart(2, '0'); // calculate remaining seconds
    return `${hours}:${minutes}:${sec}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(interval); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); 
  }, []); 

  

  return <span>{formatTime(countDown)}</span>; 
}

export default CountDown;
