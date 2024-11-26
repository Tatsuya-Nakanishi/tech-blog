import { Meta, StoryObj } from '@storybook/react';
import InputText from './index';

const meta: Meta<typeof InputText> = {
  title: 'Components/Common/InputText',
  component: InputText,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    type: {
      control: 'select',
      options: [
        'text',
        'password',
        'email',
        'number',
        'tel',
        'url',
        'search',
        'date',
        'time',
        'datetime-local',
      ],
    },
    required: { control: 'boolean' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
    className: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof InputText>;

export const Default: Story = {
  args: {
    name: 'default-input',
    value: '',
    placeholder: 'Enter text here',
  },
};

export const EmailInput: Story = {
  args: {
    name: 'email-input',
    type: 'email',
    required: true,
    value: '',
    placeholder: 'Enter your email',
  },
};

export const PasswordInput: Story = {
  args: {
    name: 'password-input',
    type: 'password',
    required: true,
    value: '',
    placeholder: 'Enter your password',
  },
};

export const NumberInput: Story = {
  args: {
    name: 'number-input',
    type: 'number',
    value: '',
    placeholder: 'Enter a number',
  },
};

export const DisabledInput: Story = {
  args: {
    name: 'disabled-input',
    value: 'This input is disabled',
    disabled: true,
  },
};

export const CustomClassInput: Story = {
  args: {
    name: 'custom-class-input',
    value: '',
    placeholder: 'Custom styled input',
    className: 'border-2 border-blue-500 rounded-md',
  },
};

export const DateInput: Story = {
  args: {
    name: 'date-input',
    type: 'date',
    value: '',
  },
};

export const ReadOnlyInput: Story = {
  args: {
    name: 'readonly-input',
    value: 'This is a read-only value',
    readOnly: true,
  },
};

export const WithMaxLength: Story = {
  args: {
    name: 'max-length-input',
    value: '',
    placeholder: 'Max 20 characters',
    maxLength: 20,
  },
};

export const WithPattern: Story = {
  args: {
    name: 'pattern-input',
    value: '',
    placeholder: 'Enter 3 digits',
    pattern: '[0-9]{3}',
  },
};
