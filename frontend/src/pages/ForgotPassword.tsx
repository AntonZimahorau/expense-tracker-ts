import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useErrorBanner } from '../components/GlobalErrorBanner/GlobalErrorBanner';
import Input from '../components/Input/Input';
import WelcomeImage from './WelcomeImage';
import Button from '../components/Button/Button';
import { forgotPassword } from '../utils/auth';

type FormValues = yup.InferType<typeof schema>;
const schema = yup
  .object({
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
  })
  .required();

export default function RestorePassword() {
  const navigate = useNavigate();
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
      await forgotPassword(values.email);
      console.log('Send code to email');
      navigate('/verification_code', {
        replace: true,
        state: { email: values.email },
      });
    } catch (error) {
      const msg = 'Failed to restore password. Please try again.';
      showError(msg);
    }
  }

  return (
    <main className={styles.card} role="main">
      <header className={styles.cardHeader}>
        <h2>Forgot Password</h2>
        <p className={styles.sub}>We will text you a code to verify it's you</p>
        <WelcomeImage />
      </header>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label className={styles.srOnly} htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          variant="bare"
          placeholder="Email"
          aria-invalid={!!errors.email}
          className={errors.email ? styles.inputError : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p className={styles.errorText}>{errors.email.message}</p>
        )}

        <Button
          type="submit"
          className={styles.btnPrimary}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Sending in...' : 'Send'}
        </Button>

        <p className={styles.signup}>
          Don’t have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </main>
  );
}
