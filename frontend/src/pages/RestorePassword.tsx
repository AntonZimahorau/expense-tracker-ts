import styles from './Auth.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useErrorBanner } from '../components/GlobalErrorBanner/GlobalErrorBanner';
import Input from '../components/Input/Input';
import WelcomeImage from './WelcomeImage';
import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';
import { restorePassword } from '../utils/auth';

type FormValues = yup.InferType<typeof schema>;
const schema = yup
  .object({
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    password_confirm: yup
      .string()
      .required('Password is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required();

export default function RestorePassword() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { email?: string } };
  const email = state?.email ?? 'fallback@example.com';
  const showError = useErrorBanner();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  async function onSubmit(values: FormValues) {
    try {
      await restorePassword(email, values.password);
      console.log('Password restored');
      navigate('/password_changed', { replace: true });
    } catch (error) {
      const msg = 'Failed to restore password. Please try again.';
      showError(msg);
    }
  }

  return (
    <main className={styles.card} role="main">
      <header className={styles.cardHeader}>
        <h2 className={styles.title}>
          <Link to="/forgot_password" className={styles.linkReset}>
            Forgot Password
          </Link>
        </h2>
        <WelcomeImage />
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label className={styles.srOnly} htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter a new password"
          aria-invalid={!!errors.password}
          className={errors.password ? styles.inputError : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p className={styles.errorText}>{errors.password.message}</p>
        )}

        <label className={styles.srOnly} htmlFor="password_confirm">
          Confirm password
        </label>
        <Input
          id="password_confirm"
          type="password"
          placeholder="Confirm your new password"
          aria-invalid={!!errors.password_confirm}
          className={errors.password_confirm ? styles.inputError : undefined}
          {...register('password_confirm')}
        />
        {errors.password_confirm && (
          <p className={styles.errorText}>{errors.password_confirm.message}</p>
        )}

        <Button
          type="submit"
          className={styles.btnPrimary}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Changing Password...' : 'Change Password'}
        </Button>
      </form>
    </main>
  );
}
