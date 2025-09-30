import styles from './Auth.module.css';
import Icon from '../components/Icon/Icon';
import React from 'react';

const WelcomeImage = React.memo(function WelcomeImage() {
  return (
    <div className={styles.lockBadge} aria-hidden>
      <div className={styles.dots}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className={styles.lock}>
        <Icon name="lock" size={34} />
      </div>
    </div>
  );
});

export default WelcomeImage;
