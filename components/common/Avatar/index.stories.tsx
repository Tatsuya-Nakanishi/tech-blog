import { Meta, StoryObj } from '@storybook/react';
import Avatar from './index';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Common/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
    fallback: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User Avatar',
  },
};

export const WithCustomClass: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'User Avatar',
    className: 'rounded-full mr-4 w-24 h-24',
  },
};

export const WithFallback: Story = {
  args: {
    src: 'https://invalid-image-url.com/image.png',
    alt: 'Invalid Image',
    fallback: 'JD',
  },
};

export const SmallAvatar: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'Small Avatar',
    className: 'rounded-full mr-2 w-8 h-8',
  },
};

export const LargeAvatar: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'Large Avatar',
    className: 'rounded-full mr-6 w-32 h-32',
  },
};

export const SquareAvatar: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'Square Avatar',
    className: 'rounded-none mr-4 w-16 h-16',
  },
};
