import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import SignUp from '../../pages/SignUp';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSignUpUser = jest.fn();
jest.mock('../../utils/auth', () => ({
  signUpUser: (...args: any[]) => mockSignUpUser(...args),
}));

const mockShowError = jest.fn();
jest.mock('../../components/GlobalErrorBanner/GlobalErrorBanner', () => ({
  useErrorBanner: () => mockShowError,
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('SignUp page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows validation messages when fields are touched and empty', async () => {
    renderWithRouter(<SignUp />);

    const name = screen.getByLabelText(/name/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    await userEvent.click(name);
    await userEvent.tab();
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

    await userEvent.click(email);
    await userEvent.tab();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    await userEvent.click(password);
    await userEvent.tab();
    expect(
      await screen.findByText(/Password must be at least 6 characters/i),
    ).toBeInTheDocument();

    const submit = screen.getByRole('button', { name: /sign up/i });
    expect(submit).toBeDisabled();
  });

  test('submits successfully and navigates to /signin', async () => {
    mockSignUpUser.mockResolvedValueOnce(undefined);

    renderWithRouter(<SignUp />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'strongpass123');

    const chk = screen.getByRole('checkbox', { name: /terms and conditions/i });
    await userEvent.click(chk);

    const submit = screen.getByRole('button', { name: /sign up/i });
    expect(submit).toBeEnabled();

    await userEvent.click(submit);

    await waitFor(() => {
      expect(mockSignUpUser).toHaveBeenCalledWith(
        'Alice',
        'alice@example.com',
        'strongpass123',
      );
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signin', { replace: true });
    });
  });

  test('shows global error when API fails and does not navigate', async () => {
    mockSignUpUser.mockRejectedValueOnce(new Error('boom'));

    renderWithRouter(<SignUp />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Bob');
    await userEvent.type(screen.getByLabelText(/email/i), 'bob@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'pass1234');

    const chk = screen.getByRole('checkbox', { name: /terms and conditions/i });
    await userEvent.click(chk);

    const submit = screen.getByRole('button', { name: /sign up/i });
    await userEvent.click(submit);

    await waitFor(() => {
      expect(mockSignUpUser).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Failed to sign up user');
    });
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
