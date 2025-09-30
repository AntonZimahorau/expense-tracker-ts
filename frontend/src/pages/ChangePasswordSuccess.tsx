import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button/Button';

export default function ChangePasswordSuccess() {
  const navigate = useNavigate();

  return (
    <main
      className={styles.imageContainer}
      role="main"
      aria-labelledby="success-title"
    >
      <img
        src="/password_changed.svg"
        alt="Password changed successfully illustration"
        className={styles.illustration}
        aria-hidden="true"
      />

      <h2 id="success-title" className={styles.title}>
        Change password successfully!
      </h2>

      <p className={styles.text}>
        You have successfully change password.
        <br />
        Please use the new password when Sign in.
      </p>

      <Button
        className={styles.btnPrimary}
        onClick={() => navigate('/signin', { replace: true })}
      >
        Ok
      </Button>
    </main>
  );
}
