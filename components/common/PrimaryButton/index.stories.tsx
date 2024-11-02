import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import PrimaryButton from './index';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Components/Common/PrimaryButton',
  component: PrimaryButton,
  argTypes: {
    width: { control: 'text' },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {
    children: 'Primary Button',
  },
};

export const CustomWidth: Story = {
  args: {
    children: 'Custom Width Button',
    width: 'w-64',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Button with Icon
      </>
    ),
  },
};