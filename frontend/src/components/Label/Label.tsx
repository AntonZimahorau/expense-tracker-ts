import React from 'react';
import styles from './Label.module.css';

interface LabelProps {
  children: string;
}

const Label: React.FC<LabelProps> = ({ children }) => {
  return <label className={styles.label}>{children}</label>;
};

export default Label;
