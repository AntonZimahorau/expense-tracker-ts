import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { signUpUser } from '../utils/auth';
import { useErrorBanner } from '../components/GlobalErrorBanner/GlobalErrorBanner';
import Input from '../components/Input/Input';
import WelcomeImage from './WelcomeImage';
import Button from '../components/Button/Button';

type FormValues = yup.InferType<typeof schema>;
const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    agree: yup
      .boolean()
      .oneOf([true], 'You must accept the Terms and Conditions'),
  })
  .required();

export default function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const showError = useErrorBanner();

  async function onSubmit(values: FormValues) {
    try {
      await signUpUser(values.name, values.email, values.password);
      console.log('Sign up');
      navigate('/signin', { replace: true });
    } catch (error) {
      const msg = 'Failed to sign up user';
      showError(msg);
    }
  }

  return (
    <main className={styles.card} role="main">
      <header className={styles.cardHeader}>
        <h2>Welcome to us,</h2>
        <p className={styles.sub}>Hello there, create New account</p>
        <WelcomeImage />
      </header>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label className={styles.srOnly} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="name"
          placeholder="How can we call you?"
          aria-invalid={!!errors.name}
          className={errors.name ? styles.inputError : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p className={styles.errorText}>{errors.name.message}</p>
        )}

        <label className={styles.srOnly} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Provide your email"
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
          placeholder="Create a strong password"
          aria-invalid={!!errors.password}
          className={errors.password ? styles.inputError : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p className={styles.errorText}>{errors.password.message}</p>
        )}

        <div className={styles.consentRow}>
          <Input
            id="agree"
            type="checkbox"
            {...register?.('agree', { required: true })}
          />
          <label htmlFor="agree" className={styles.consentText}>
            By creating an account your agree to our{' '}
            <Link className={styles.termsLink} to="/terms">
              Terms and Conditions
            </Link>
          </label>
        </div>
        {errors.agree && (
          <p className={styles.errorText}>{errors.agree.message}</p>
        )}

        <Button
          type="submit"
          className={styles.btnPrimary}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </Button>

        <p className={styles.signup}>
          Have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </main>
  );
}
