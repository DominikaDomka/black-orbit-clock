import React, { useState, useEffect, useRef } from 'react';

const SVGTimeWidget = () => {
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

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
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
    return <circle key={i} cx={x} cy={y} r="3" fill="#333" />;
  });

  return (
    <div className="clock-container">
      <svg width="256" height="256" viewBox="0 0 256 256">
        {/* Outermost circle */}
        <circle cx="128" cy="128" r={outerRadius} fill="none" stroke="#333" strokeWidth="1" />
        {/* Middle circle */}
        <circle cx="128" cy="128" r={middleRadius} fill="none" stroke="#333" strokeWidth="1" />
        {/* Inner circle */}
        <circle cx="128" cy="128" r={innerRadius} fill="none" stroke="#333" strokeWidth="1" />
        {/* Hour markers */}
        {hourMarkers}
        {/* Circle around the first dot */}
        <circle cx={firstDotX} cy={firstDotY} r="13" fill="none" stroke="#333" strokeWidth="1" />
        {/* Fourth dot (outermost) */}
        <circle cx={fourthDotX} cy={fourthDotY} r="12" fill="#333" />
        {/* Third dot (middle) */}
        <circle cx={thirdDotX} cy={thirdDotY} r="10" fill="#333" />
        {/* First dot (inner) */}
        <circle cx={firstDotX} cy={firstDotY} r="8" fill="#333" />
        {/* Second dot (innermost) */}
        <circle cx={secondDotX} cy={secondDotY} r="2" fill="#333" />
      </svg>

      <div className="time-display">
        <div className="time">
          {formatTime(date)}
        </div>
        <div className="day">
          {date.toLocaleDateString('en-US', { weekday: 'long' })}
        </div>
        <div className="date">
          {formatDate(date)}
        </div>
      </div>
    </div>
  );
};

export default SVGTimeWidget;