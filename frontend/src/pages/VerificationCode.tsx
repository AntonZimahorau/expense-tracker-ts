import styles from './Auth.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

type FormValues = yup.InferType<typeof schema>;
const schema = yup
  .object({
    code: yup.string().required('Verification code is required'),
  })
  .required();

export default function VerificationCode() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { email?: string } };
  const email = state?.email ?? 'fallback@example.com';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  async function onSubmit(values: FormValues) {
    console.log('Lke send code to backend for verification');
    navigate('/restore_password', {
      replace: true,
      state: { email: email },
    });
  }
  function handleResend() {}

  return (
    <main className={styles.card} role="main">
      <header className={styles.cardHeader}>
        <h2 className={styles.title}>
          <Link to="/forgot_password" className={styles.linkReset}>
            Forgot Password
          </Link>
        </h2>
        <p className={styles.sub}>Type a code</p>
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.inputRow}>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="code"
            maxLength={6}
            aria-invalid={!!errors.code}
            className={errors.code ? styles.inputError : undefined}
            {...register('code')}
          />
          <Button
            type="button"
            className={styles.btnPrimary}
            onClick={handleResend}
            disabled={isSubmitting}
          >
            Resend
          </Button>
        </div>

        <p className={styles.muted}>
          We have texted you a code to verify your email{' '}
          <span className={styles.email}>{email}</span>
        </p>
        <p className={styles.muted}>This code expires in 10 minutes.</p>

        <Button
          type="submit"
          className={styles.btnPrimary}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Changing Password' : 'Change Password'}
        </Button>

        <p className={styles.signup}>
          Don’t have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </main>
  );
}
