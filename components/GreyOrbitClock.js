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
  const innerRadius = 50;
  const middleRadius = 80;
  const outerRadius = 110;

  // First dot (inner circle) - 60 second revolution
  const firstDotAngle = ((seconds * 1000 + milliseconds) / 60000) * 360;
  const firstDotX = 128 + innerRadius * Math.cos((firstDotAngle - 90) * Math.PI / 180);
  const firstDotY = 128 + innerRadius * Math.sin((firstDotAngle - 90) * Math.PI / 180);

  // Second dot (small circle around first) - 1 second revolution
  const secondDotAngle = (milliseconds / 1000) * 360;
  const secondDotRadius = 13;
  const secondDotX = firstDotX + secondDotRadius * Math.cos((secondDotAngle - 90) * Math.PI / 180);
  const secondDotY = firstDotY + secondDotRadius * Math.sin((secondDotAngle - 90) * Math.PI / 180);

  // Third dot (middle circle) - 60 minute revolution
  const thirdDotAngle = ((minutes * 60 + seconds) / 3600) * 360;
  const thirdDotX = 128 + middleRadius * Math.cos((thirdDotAngle - 90) * Math.PI / 180);
  const thirdDotY = 128 + middleRadius * Math.sin((thirdDotAngle - 90) * Math.PI / 180);

  // Fourth dot (outer circle) - 24 hour revolution
  const fourthDotAngle = ((hours * 3600 + minutes * 60 + seconds) / 86400) * 360;
  const fourthDotX = 128 + outerRadius * Math.cos((fourthDotAngle - 90) * Math.PI / 180);
  const fourthDotY = 128 + outerRadius * Math.sin((fourthDotAngle - 90) * Math.PI / 180);

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const x = 128 + middleRadius * Math.cos((angle - 90) * Math.PI / 180);
    const y = 128 + middleRadius * Math.sin((angle - 90) * Math.PI / 180);
    return <circle key={i} cx={x} cy={y} r="3" fill="#bbbbbb" />;
  });

  return (
    <div className="clock-container">
      <svg width="256" height="256" viewBox="0 0 256 256">
        {/* Outermost circle */}
        <circle cx="128" cy="128" r={outerRadius} fill="none" stroke="#cccccc" strokeWidth="1" />
        {/* Middle circle */}
        <circle cx="128" cy="128" r={middleRadius} fill="none" stroke="#bbbbbb" strokeWidth="1" />
        {/* Inner circle */}
        <circle cx="128" cy="128" r={innerRadius} fill="none" stroke="#aaaaaa" strokeWidth="1" />
        {/* Hour markers */}
        {hourMarkers}
        {/* Circle around the first dot */}
        <circle cx={firstDotX} cy={firstDotY} r="13" fill="none" stroke="#999999" strokeWidth="1" />
        {/* Fourth dot (outermost) */}
        <circle cx={fourthDotX} cy={fourthDotY} r="12" fill="#cccccc" />
        {/* Third dot (middle) */}
        <circle cx={thirdDotX} cy={thirdDotY} r="10" fill="#bbbbbb" />
        {/* First dot (inner) */}
        <circle cx={firstDotX} cy={firstDotY} r="8" fill="#aaaaaa" />
        {/* Second dot (innermost) */}
        <circle cx={secondDotX} cy={secondDotY} r="2" fill="#999999" />
        {/* Day text in the center */}
        <text 
          x="128" 
          y="115" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#ffffff" 
          fontSize="14" 
          fontWeight="bold"
          fontFamily="'Times New Roman', Times, serif"
        >
          {formatDay(date)}
        </text>
        {/* Date text below day */}
        <text 
          x="128" 
          y="133" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#dddddd" 
          fontSize="12"
          fontFamily="'Times New Roman', Times, serif"
        >
          {formatDate(date)}
        </text>
        {/* Week number below date */}
        <text 
          x="128" 
          y="149" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="#dddddd" 
          fontSize="10"
          fontFamily="'Times New Roman', Times, serif"
        >
          week: {getWeekNumber(date)}
        </text>
      </svg>
    </div>
  );
};

export default GreyOrbitClock;