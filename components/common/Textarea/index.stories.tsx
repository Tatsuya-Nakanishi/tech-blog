import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Textarea from './index';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Common/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    placeholder: { control: 'text' },
    className: { control: 'text' },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here',
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is some preset text',
    placeholder: 'Enter your text here',
  },
};

export const CustomRows: Story = {
  args: {
    placeholder: 'This textarea has 5 rows',
    rows: 5,
  },
};

export const Disabled: Story = {
  args: {
    value: 'This textarea is disabled',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    placeholder: 'This field is required',
    required: true,
  },
};

export const CustomClass: Story = {
  args: {
    placeholder: 'Custom styled textarea',
    className: 'border-2 border-blue-500 rounded-md p-2',
  },
};

export const ReadOnly: Story = {
  args: {
    value: 'This is a read-only textarea',
    readOnly: true,
  },
};

export const WithMaxLength: Story = {
  args: {
    placeholder: 'Max 100 characters',
    maxLength: 100,
  },
};

export const WithMinLength: Story = {
  args: {
    placeholder: 'Min 10 characters',
    minLength: 10,
  },
};

export const Resizable: Story = {
  args: {
    placeholder: 'This textarea is resizable',
    className: 'resize-y',
  },
};