import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import SideMenu from './index';

const meta: Meta<typeof SideMenu> = {
  title: 'Features/Common/SideMenu',
  component: SideMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SideMenu>;

const mockCategories = [
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'TypeScript' },
  { name: 'Laravel' },
  { name: 'PHP' },
];

const mockArchives = [
  '2023年5月',
  '2023年4月',
  '2023年3月',
  '2023年2月',
  '2023年1月',
];

export const Default: Story = {
  args: {
    categories: mockCategories,
    archives: mockArchives,
  },
};