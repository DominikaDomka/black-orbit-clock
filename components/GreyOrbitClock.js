import React, { useState, useEffect, useRef } from 'react';

const GreyOrbitClock = () => {
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

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  };

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  // Adjusted circle radii
  const innerRadius = 58;
  const middleRadius = 93;
  const outerRadius = 128;

  // Center point
  const centerX = 150;
  const centerY = 150;

  // First dot (inner circle) - 60 second revolution
  const firstDotAngle = ((seconds * 1000 + milliseconds) / 60000) * 360;
  const firstDotX = centerX + innerRadius * Math.cos((firstDotAngle - 90) * Math.PI / 180);
  const firstDotY = centerY + innerRadius * Math.sin((firstDotAngle - 90) * Math.PI / 180);

  // Second dot (small circle around first) - 1 second revolution
  const secondDotAngle = (milliseconds / 1000) * 360;
  const secondDotRadius = 15;
  const secondDotX = firstDotX + secondDotRadius * Math.cos((secondDotAngle - 90) * Math.PI / 180);
  const secondDotY = firstDotY + secondDotRadius * Math.sin((secondDotAngle - 90) * Math.PI / 180);

  // Third dot (middle circle) - 60 minute revolution
  const thirdDotAngle = ((minutes * 60 + seconds) / 3600) * 360;
  const thirdDotX = centerX + middleRadius * Math.cos((thirdDotAngle - 90) * Math.PI / 180);
  const thirdDotY = centerY + middleRadius * Math.sin((thirdDotAngle - 90) * Math.PI / 180);

  // Fourth dot (outer circle) - 24 hour revolution
  const fourthDotAngle = ((hours * 3600 + minutes * 60 + seconds) / 86400) * 360;
  const fourthDotX = centerX + outerRadius * Math.cos((fourthDotAngle - 90) * Math.PI / 180);
  const fourthDotY = centerY + outerRadius * Math.sin((fourthDotAngle - 90) * Math.PI / 180);

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const x = centerX + middleRadius * Math.cos((angle - 90) * Math.PI / 180);
    const y = centerY + middleRadius * Math.sin((angle - 90) * Math.PI / 180);
    return <circle key={i} cx={x} cy={y} r="3" fill="#bbbbbb" />;
  });

  return (
    <div className="clock-container">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Outermost circle */}
        <circle cx={centerX} cy={centerY} r={outerRadius} fill="none" stroke="#cccccc" strokeWidth="1.2" />
        {/* Middle circle */}
        <circle cx={centerX} cy={centerY} r={middleRadius} fill="none" stroke="#bbbbbb" strokeWidth="1.2" />
        {/* Inner circle */}
        <circle cx={centerX} cy={centerY} r={innerRadius} fill="none" stroke="#aaaaaa" strokeWidth="1.2" />
        {/* Hour markers */}
        {hourMarkers}
        {/* Circle around the first dot */}
        <circle cx={firstDotX} cy={firstDotY} r="15" fill="none" stroke="#999999" strokeWidth="1.2" />
        {/* Fourth dot (outermost) */}
        <circle cx={fourthDotX} cy={fourthDotY} r="14" fill="#cccccc" />
        {/* Third dot (middle) */}
        <circle cx={thirdDotX} cy={thirdDotY} r="12" fill="#bbbbbb" />
        {/* First dot (inner) */}
        <circle cx={firstDotX} cy={firstDotY} r="10" fill="#aaaaaa" />
        {/* Second dot (innermost) */}
        <circle cx={secondDotX} cy={secondDotY} r="2.5" fill="#999999" />
        {/* Day text in the center */}
        <text 
          x={centerX}
          y={centerY - 10}
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#ffffff" 
          fontSize="16" 
          fontWeight="bold"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {formatDay(date)}
        </text>
        {/* Date text below day */}
        <text 
          x={centerX}
          y={centerY + 10}
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#dddddd" 
          fontSize="14"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {formatDate(date)}
        </text>
        {/* Week number below date */}
        <text 
          x={centerX}
          y={centerY + 28}
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#dddddd" 
          fontSize="12"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          week: {getWeekNumber(date)}
        </text>
      </svg>
    </div>
  );
};

export default GreyOrbitClock;