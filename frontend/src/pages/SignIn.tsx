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
import { useAuth } from '../store/auth-context';

type FormValues = yup.InferType<typeof schema>;
const schema = yup
  .object({
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })
  .required();

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      const token = await login(values.email, values.password);
      console.log('Logged in with token:', token);
      navigate('/', { replace: true });
    } catch (error) {
      const msg = 'Failed to login user';
      showError(msg);
    }
  }

  return (
    <main className={styles.card} role="main">
      <header className={styles.cardHeader}>
        <h2>Welcome Back</h2>
        <p className={styles.sub}>Hello there, sign in to continue</p>
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

        <label className={styles.srOnly} htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          variant="bare"
          aria-invalid={!!errors.password}
          className={errors.password ? styles.inputError : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p className={styles.errorText}>{errors.password.message}</p>
        )}

        <div className={styles.metaRow}>
          <Link to="/forgot_password">Forgot your password ?</Link>
        </div>

        <Button
          type="submit"
          className={styles.btnPrimary}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className={styles.signup}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </main>
  );
}
