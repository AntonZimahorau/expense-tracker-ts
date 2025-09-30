import React from 'react';
import cn from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button className={cn(styles.button, className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
