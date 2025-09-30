import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';

import SideBar from '../../components/SideBar/SideBar';
import { TransactionContext } from '../../store/transactions-context';

jest.mock('../../components/Button/Button', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => React.createElement('button', props),
  };
});

jest.mock('../../components/Input/Input', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props: any, ref: any) =>
      React.createElement('input', { ref, ...props }),
    ),
  };
});

jest.mock('../../components/DatePicker/DatePicker', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef(
      (
        {
          defaultValue,
          onChange,
          ...rest
        }: { defaultValue?: string; onChange?: any },
        _ref: any,
      ) =>
        React.createElement('input', {
          type: 'date',
          defaultValue,
          onChange,
          ...rest,
        }),
    ),
  };
});

jest.mock('../../components/IconButton/IconButton', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ name, onSelect, selected }: any) =>
      React.createElement(
        'button',
        {
          type: 'button',
          'aria-pressed': !!selected,
          onClick: () => onSelect(name),
        },
        name,
      ),
  };
});

jest.mock('../../components/UploadInvoiceModal/UploadInvoiceModal', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="invoice-modal" /> : null,
}));

describe('SideBar (minimal)', () => {
  const handleCloseSideBar = jest.fn();
  const handleUpdateTransaction = jest.fn();
  const handleCreateTransaction = jest.fn();

  function renderWithCtx() {
    const ctxValue = {
      handleCloseSideBar,
      editTransaction: null,
      handleUpdateTransaction,
      handleCreateTransaction,
    } as any;

    return render(
      <TransactionContext.Provider value={ctxValue}>
        <SideBar />
      </TransactionContext.Provider>,
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic fields and Cancel works', async () => {
    renderWithCtx();

    expect(screen.getByPlaceholderText(/text input/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^0$/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upload invoice/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelBtn);
    expect(handleCloseSideBar).toHaveBeenCalled();
  });

  test('shows validation errors on empty submit', async () => {
    renderWithCtx();

    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    expect(screen.getByText(/amount must be a number/i)).toBeInTheDocument();
  });

  test('opens invoice modal when clicking Upload Invoice', async () => {
    renderWithCtx();

    expect(screen.queryByTestId('invoice-modal')).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /upload invoice/i }),
    );
    expect(screen.getByTestId('invoice-modal')).toBeInTheDocument();
  });

  test('submits a valid Create and calls handleCreateTransaction', async () => {
    renderWithCtx();

    const today = format(new Date(), 'yyyy-MM-dd');

    await userEvent.type(
      screen.getByPlaceholderText(/text input/i),
      ' Coffee ',
    );
    await userEvent.type(screen.getByPlaceholderText(/^0$/), '12.5');

    await userEvent.click(screen.getByRole('button', { name: 'restaurants' }));
    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(handleCreateTransaction).toHaveBeenCalledWith({
      name: 'Coffee',
      category: 'restaurants',
      currency: 'USD',
      date: today,
      amount: 12.5,
      user_id: 1,
    });
  });
});
