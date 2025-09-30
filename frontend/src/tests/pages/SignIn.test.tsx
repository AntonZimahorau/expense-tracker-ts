import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import SignIn from '../../pages/SignIn';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogin = jest.fn();
jest.mock('../../store/auth-context', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

const mockShowError = jest.fn();
jest.mock('../../components/GlobalErrorBanner/GlobalErrorBanner', () => ({
  useErrorBanner: () => mockShowError,
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('SignIn page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows validation messages when fields are touched and empty', async () => {
    renderWithRouter(<SignIn />);

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    await userEvent.click(email);
    await userEvent.tab();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    await userEvent.click(password);
    await userEvent.tab();
    expect(
      await screen.findByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument();

    const submit = screen.getByRole('button', { name: /sign in/i });
    expect(submit).toBeDisabled();
  });

  test('submits successfully and navigates to /', async () => {
    mockLogin.mockResolvedValueOnce('token-123');

    renderWithRouter(<SignIn />);

    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'strongpass123');

    const submit = screen.getByRole('button', { name: /sign in/i });
    expect(submit).toBeEnabled();

    await userEvent.click(submit);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'alice@example.com',
        'strongpass123',
      );
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  test('shows global error when API fails and does not navigate', async () => {
    mockLogin.mockRejectedValueOnce(new Error('boom'));

    renderWithRouter(<SignIn />);

    await userEvent.type(screen.getByLabelText(/email/i), 'bob@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass1234');

    const submit = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submit);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to login user');
    });
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
