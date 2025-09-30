import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button/Button';

export default function TermsInfo() {
  const navigate = useNavigate();

  return (
    <main
      className={styles.imageContainer}
      role="main"
      aria-labelledby="terms-title"
    >
      <img
        src="/password_changed.svg"
        alt="Password changed successfully illustration"
        className={styles.illustration}
        aria-hidden="true"
      />

      <h2 id="terms-title" className={styles.title}>
        Terms &amp; Conditions
      </h2>

      <p className={styles.text}>
        By creating an account or continuing to use YAET, you agree to our{' '}
        <a href="/terms" target="_blank" rel="noopener noreferrer">
          Terms and Conditions
        </a>{' '}
        and Privacy Policy . Please review them before proceeding.
      </p>

      <Button className={styles.btnPrimary} onClick={() => navigate('/signup')}>
        Ok
      </Button>
    </main>
  );
}
