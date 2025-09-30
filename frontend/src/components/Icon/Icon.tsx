import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'grey' }) => {
  return (
    <svg width={size} height={size} fill={color}>
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
};

export default Icon;
