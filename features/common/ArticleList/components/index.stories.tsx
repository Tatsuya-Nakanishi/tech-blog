import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ArticleList from './index';
import { ArticleType } from '@/types/article';

const meta: Meta<typeof ArticleList> = {
  title: 'Features/Common/ArticleList',
  component: ArticleList,
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
type Story = StoryObj<typeof ArticleList>;

const mockArticles: ArticleType[] = [
  {
    id: '1',
    title: 'テスト記事1',
    content: 'これはテスト記事1の内容です。',
    image_url: 'https://via.placeholder.com/300x200',
    description: 'テスト記事1の説明文です。',
    created_at: '2023-05-01T12:00:00Z',
    categories: ['技術', 'プログラミング'],
  },
  {
    id: '2',
    title: 'テスト記事2',
    content: 'これはテスト記事2の内容です。',
    image_url: 'https://via.placeholder.com/300x200',
    description: 'テスト記事2の説明文です。',
    created_at: '2023-05-02T14:30:00Z',
    categories: ['デザイン', 'UI/UX'],
  },
];

export const HasMorePage: Story = {
  args: {
    articles: mockArticles,
    heading: '最新の記事',
    initialHasMore: true,
  },
};

export const NotHasMorePage: Story = {
  args: {
    articles: mockArticles,
    heading: '最新の記事',
    initialHasMore: false,
  },
};
