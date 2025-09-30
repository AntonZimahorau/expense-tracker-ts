import Input from '../Input/Input';
import React from 'react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const DatePicker: React.FC<DatePickerProps> = ({ ...props }) => {
  return <Input type="date" {...props} />;
};

export default DatePicker;
