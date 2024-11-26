import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Header from './index';
import { UserType } from '@/types/user';

const meta: Meta<typeof Header> = {
  title: 'Features/Common/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

const mockedUser: UserType = {
  id: '1',
  email: 'user@example.com',
  nickname: 'TestUser',
  avatar_url: '/me.jpg',
  created_at: '2024-12-24',
  updated_at: '2024-12-24',
};

export const LoggedIn: Story = {
  args: {
    user: mockedUser,
  },
};

export const LoggedOut: Story = {
  args: {
    user: null,
  },
};
