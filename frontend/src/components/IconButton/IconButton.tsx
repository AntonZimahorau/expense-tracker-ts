import React from 'react';

import styles from './IconButton.module.css';
import Icon from '../Icon/Icon';
import cn from 'clsx';

interface IconButtonProps {
  name: string;
  size?: number;
  selected: boolean;
  onSelect: (name: string) => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  name,
  size,
  selected = false,
  onSelect,
}) => {
  return (
    <div className={styles.iconList}>
      <button
        type="button"
        className={cn(styles.iconButton, selected && styles.selected)}
        key={name}
        onClick={() => onSelect(name)}
        aria-label={name}
      >
        <Icon name={name} size={size} />
      </button>
    </div>
  );
};

export default IconButton;
