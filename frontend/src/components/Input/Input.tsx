import React from 'react';
import cn from 'clsx';
import styles from './Input.module.css';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'bare';
  className?: string;
}

const Input: React.FC<InputProps> = ({
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <input
      className={cn(
        variant === 'default' && styles.input,
        variant === 'bare' && styles.bare,
        className,
      )}
      {...props}
    />
  );
};

export default Input;
