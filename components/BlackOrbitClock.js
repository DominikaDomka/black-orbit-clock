import React, { useState, useEffect, useRef } from 'react';

const BlackOrbitClock = () => {
  const [date, setDate] = useState(new Date());
  const requestRef = useRef();

  const animate = time => {
    setDate(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  const innerRadius = 58;
  const middleRadius = 93;
  const outerRadius = 128;

  const centerX = 150;
  const centerY = 150;

  const firstDotAngle = ((seconds * 1000 + milliseconds) / 60000) * 360;
  const firstDotX = centerX + innerRadius * Math.cos((firstDotAngle - 90) * Math.PI / 180);
  const firstDotY = centerY + innerRadius * Math.sin((firstDotAngle - 90) * Math.PI / 180);

  const secondDotAngle = (milliseconds / 1000) * 360;
  const secondDotRadius = 15;
  const secondDotX = firstDotX + secondDotRadius * Math.cos((secondDotAngle - 90) * Math.PI / 180);
  const secondDotY = firstDotY + secondDotRadius * Math.sin((secondDotAngle - 90) * Math.PI / 180);

  const thirdDotAngle = ((minutes * 60 + seconds) / 3600) * 360;
  const thirdDotX = centerX + middleRadius * Math.cos((thirdDotAngle - 90) * Math.PI / 180);
  const thirdDotY = centerY + middleRadius * Math.sin((thirdDotAngle - 90) * Math.PI / 180);

  const fourthDotAngle = ((hours * 3600 + minutes * 60 + seconds) / 86400) * 360;
  const fourthDotX = centerX + outerRadius * Math.cos((fourthDotAngle - 90) * Math.PI / 180);
  const fourthDotY = centerY + outerRadius * Math.sin((fourthDotAngle - 90) * Math.PI / 180);

  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const x = centerX + middleRadius * Math.cos((angle - 90) * Math.PI / 180);
    const y = centerY + middleRadius * Math.sin((angle - 90) * Math.PI / 180);
    return <circle key={i} cx={x} cy={y} r="3" fill="#333333" />;
  });

  return (
    <div className="clock-container">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke="#222222" strokeWidth="1.2" />
        <circle cx={centerX} cy={centerY} r={middleRadius} fill="none" stroke="#333333" strokeWidth="1.2" />
        <circle cx={centerX} cy={centerY} r={innerRadius} fill="none" stroke="#444444" strokeWidth="1.2" />
        {hourMarkers}
        <circle cx={firstDotX} cy={firstDotY} r="15" fill="none" stroke="#555555" strokeWidth="1.2" />
        <circle cx={fourthDotX} cy={fourthDotY} r="14" fill="#222222" />
        <circle cx={thirdDotX} cy={thirdDotY} r="12" fill="#333333" />
        <circle cx={firstDotX} cy={firstDotY} r="10" fill="#444444" />
        <circle cx={secondDotX} cy={secondDotY} r="2.5" fill="#555555" />
        <text 
          x={centerX}
          y={centerY - 15}
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#111111" 
          fontSize="16" 
          fontWeight="bold"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {formatDay(date)}
        </text>
        <text 
          x={centerX}
          y={centerY + 7}
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#111111" 
          fontSize="16"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {formatTime(date)}
        </text>
        <text 
          x={centerX}
          y={centerY + 29}
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#111111" 
          fontSize="14"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {formatDate(date)}
        </text>
      </svg>
    </div>
  );
};

export default BlackOrbitClock;