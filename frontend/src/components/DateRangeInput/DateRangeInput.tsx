import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './DateRangeInput.module.css';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import { TransactionContext } from '../../store/transactions-context';

const DateRangeInput: React.FC = React.memo(function DateRangeInput() {
  const { dateRange, handleSetDateRange } =
    React.useContext(TransactionContext);

  const [startDate, setStartDate] = React.useState<Date>(dateRange.startDate);
  const [endDate, setEndDate] = React.useState<Date>(dateRange.endDate);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const label = `${format(startDate!, 'dd LLL yyyy')} – ${format(
    endDate!,
    'dd LLL yyyy',
  )}`;

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function handleSetDateClick() {
    handleSetDateRange({ startDate, endDate });
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.inline}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon name="calendar" color="white" size={20} />
        <span className={styles.text}>{label}</span>
      </button>

      {open && (
        <div className={styles.popup}>
          <ReactDatePicker
            inline
            selectsRange
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => {
              const [start, end] = dates as [Date, Date];
              setStartDate(start);
              setEndDate(end);
            }}
            calendarClassName={styles.calendar}
          />
          <div className={styles.footer}>
            <Button
              type="button"
              className={styles.primary}
              onClick={handleSetDateClick}
              disabled={!startDate || !endDate}
            >
              Set Date
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default DateRangeInput;
