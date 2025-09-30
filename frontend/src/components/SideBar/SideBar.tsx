import React from 'react';
import styles from './SideBar.module.css';
import IconButton from '../IconButton/IconButton';
import DatePicker from '../DatePicker/DatePicker';
import Label from '../Label/Label';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { NewTransaction, CATEGORIES, CURRENCIES } from '../../utils/utils';
import { CurrencyCode } from '../../utils/utils';
import { TransactionContext } from '../../store/transactions-context';
import { format } from 'date-fns';
import UploadInvoiceModal from '../UploadInvoiceModal/UploadInvoiceModal';
import ReactDOM from 'react-dom';

const SideBar: React.FC = React.memo(function SideBar() {
  const {
    handleCloseSideBar,
    editTransaction,
    handleUpdateTransaction,
    handleCreateTransaction,
  } = React.useContext(TransactionContext);

  const isEdit = !!editTransaction;

  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [amountStr, setAmountStr] = React.useState('');
  const [currency, setCurrency] = React.useState<CurrencyCode>('USD');
  const [date, setDate] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );

  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (editTransaction) {
      setName(editTransaction.name);
      setAmountStr(String(editTransaction.amount));
      setCurrency(editTransaction.currency as CurrencyCode);
      setDate(editTransaction.date);
      setSelectedCategory(editTransaction.category);
    } else {
      const today = format(new Date(), 'yyyy-MM-dd');
      setDate(today);
    }

    setErrors([]);
  }, [editTransaction]);

  const handleSelectCategory = (name: string) => {
    setSelectedCategory((prev) => (prev === name ? null : name));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('Name is required');
    if (!selectedCategory) errs.push('Category is required');
    if (!currency) errs.push('Currency is required');
    if (!date) errs.push('Date is required');

    const n = Number(amountStr);
    if (!amountStr || Number.isNaN(n)) errs.push('Amount must be a number');
    return errs;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }
    if (!selectedCategory || !currency || !date) return;

    setSubmitting(true);
    setErrors([]);

    const amountNum = Number(amountStr);

    if (isEdit && editTransaction) {
      handleUpdateTransaction(editTransaction.id, {
        name: name.trim(),
        category: selectedCategory,
        currency,
        date,
        amount: amountNum,
      });
    } else {
      const payload: NewTransaction = {
        name: name.trim(),
        category: selectedCategory,
        currency,
        date,
        amount: amountNum,
        user_id: 1,
      };
      handleCreateTransaction(payload);
    }

    setSubmitting(false);
  };

  function handleOpenInvoiceModal() {
    setModalIsOpen(true);
  }
  function handleCloseInvoiceModal() {
    setModalIsOpen(false);
  }
  function handlePrefillInvoice(data: any) {
    console.log('Prefill with', data);
    setName(data.name);
    setSelectedCategory(data.category);
    setCurrency(data.currency);
    setDate(data.date);
    setAmountStr(String(data.amount));
  }

  return (
    <>
      {ReactDOM.createPortal(
        <UploadInvoiceModal
          isOpen={modalIsOpen}
          onClose={handleCloseInvoiceModal}
          onPrefill={handlePrefillInvoice}
        />,
        document.body,
      )}

      <form className={styles.sidebar} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Text input"
          />
        </div>

        <div className={styles.fieldGroup}>
          <Label>Payment amount</Label>
          <div className={styles.inputGroup}>
            <Input
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0"
              variant="bare"
              className={styles.amountField}
            />
            <select
              className={styles.currencySelector}
              value={currency || 'USD'}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <Label>Select category</Label>
          <div className={styles.iconGrid}>
            {CATEGORIES.map((cat) => (
              <IconButton
                key={cat}
                name={cat}
                selected={selectedCategory === cat}
                onSelect={handleSelectCategory}
              />
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <Label>Select date</Label>
          <DatePicker
            defaultValue={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {errors.length > 0 && (
          <div className={styles.errorBox}>
            <ul>
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <Button
          type="button"
          className={styles.uploadBtn}
          onClick={handleOpenInvoiceModal}
        >
          Upload Invoice
        </Button>

        <div className={styles.buttonGroup}>
          <Button
            type="button"
            className={styles.cancelButton}
            onClick={handleCloseSideBar}
            disabled={submitting}
            aria-label="Cancel"
          >
            ✕
          </Button>
          <Button
            type="submit"
            className={styles.createButton}
            disabled={submitting}
          >
            {submitting
              ? isEdit
                ? 'Updating…'
                : 'Creating…'
              : isEdit
                ? 'Update'
                : 'Create'}
          </Button>
        </div>
      </form>
    </>
  );
});

export default SideBar;
