import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Tag from './index';

const meta: Meta<typeof Tag> = {
  title: 'Components/Common/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'text' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Default Tag',
  },
};

export const CustomBackground: Story = {
  args: {
    backgroundColor: 'bg-green-100',
    children: 'Custom Background',
  },
};

export const LongText: Story = {
  args: {
    children: 'This is a tag with a very long text content',
  },
};

export const WithEmoji: Story = {
  args: {
    children: '🚀 Rocket Tag',
  },
};

export const MultipleWords: Story = {
  args: {
    children: 'Multiple Words Tag',
  },
};

export const RedBackground: Story = {
  args: {
    backgroundColor: 'bg-red-100',
    children: 'Red Tag',
  },
};

export const YellowBackground: Story = {
  args: {
    backgroundColor: 'bg-yellow-100',
    children: 'Yellow Tag',
  },
};

const TagGroup: React.FC = () => (
  <div className="flex flex-wrap gap-2">
    <Tag>Tag 1</Tag>
    <Tag backgroundColor="bg-green-100">Tag 2</Tag>
    <Tag backgroundColor="bg-red-100">Tag 3</Tag>
    <Tag backgroundColor="bg-yellow-100">Tag 4</Tag>
  </div>
);

export const GroupOfTags: Story = {
  render: () => <TagGroup />,
};