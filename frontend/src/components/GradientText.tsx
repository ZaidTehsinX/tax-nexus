import React from 'react';

interface GradientTextProps {
  staticText?: string;
  animatedText: string;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  staticText,
  animatedText,
  className = ''
}) => {
  return (
    <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${className}`}>
      {staticText && <span className="text-gray-800">{staticText}</span>}
      <span className="gradient-text">{animatedText}</span>
    </h1>
  );
};

export default GradientText;
