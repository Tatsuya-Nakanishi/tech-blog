'use client';

import { Heart, Trash2 } from 'lucide-react';
import Textarea from '@/components/common/Textarea';
import Avatar from '@/components/common/Avatar';
import { useArticleDetail } from '../hooks';
import { ArticleType } from '@/types/article';
import { CommentType } from '@/types/comment';
import PrimaryButton from '@/components/common/PrimaryButton';
import Tag from '@/components/common/Tag';
import { format } from 'date-fns';
import { UserType } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';

type ArticleDetailProps = {
  article: ArticleType;
  initialLikes: number;
  initialComments: CommentType[];
  user: UserType | null;
  isLiked: boolean;
};

export default function Component({
  article,
  initialLikes,
  initialComments,
  user,
  isLiked,
}: ArticleDetailProps) {
  const {
    likes,
    handleLike,
    comments,
    newComment,
    setNewComment,
    handleCommentSubmit,
    handleCommentDelete,
    tableOfContents,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isAlreadyLiked,
  } = useArticleDetail(initialLikes, initialComments, article, user, isLiked);
  return (
    <div className="md:w-2/3 md:pr-8">
      <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex space-x-2">
          {article.categories.map((category, index) => (
            <Tag key={index}>#{category}</Tag>
          ))}
        </div>
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
        >
          <Heart
            className={`h-5 w-5 ${isAlreadyLiked ? 'fill-current text-red-500' : ''}`}
          />
          <span>{likes}</span>
        </button>
      </div>
      <div className="mb-2 text-gray-500">
        {format(new Date(article.created_at), 'yyyy年MM月dd日')}
      </div>
      <div className="mb-6">
        <img
          src={article.image_url || ''}
          alt={article.title}
          className="h-auto w-full rounded-lg"
        />
      </div>
      <div className="mb-8 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-xl font-semibold">目次</h2>
        <ul className="space-y-1">
          {tableOfContents.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-gray-700 hover:text-gray-900 hover:underline"
              >
                <span className="border-b border-gray-300">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: article.content }}
        className="prose max-w-none"
      />
      {/* コメントセクション */}
      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">コメント</h2>
        {comments.length > 0 &&
          comments.map((comment) => (
            <div key={comment.id} className="mb-4 rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center">
                <Avatar
                  className="mr-3 h-10 w-10"
                  src={comment.avatar}
                  alt={comment.author}
                />
                <div>
                  <div className="font-semibold">{comment.author}</div>
                  <div className="text-sm text-gray-500">{comment.date}</div>
                </div>
              </div>
              {user && user.id === comment.userId && (
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="コメントを削除"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              <p>{comment.content}</p>
            </div>
          ))}
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="コメントを入力してください"
          className="mb-2"
        />
        <PrimaryButton width="w-60" type="button" onClick={() => handleCommentSubmit()}>
          コメントを投稿
        </PrimaryButton>
      </div>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="mx-auto max-w-sm bg-white p-6">
          <div className="flex flex-col items-center">
            <DialogHeader className="mb-4 text-center">
              <DialogTitle className="mb-2 text-xl font-semibold">
                ログインが必要です
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                いいねまたはコメントをするにはログインが必要です。
                <br />
                ログインページに移動しますか？
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex w-full justify-center space-x-4">
              <PrimaryButton onClick={() => setIsLoginModalOpen(false)} className="w-1/2">
                キャンセル
              </PrimaryButton>
              <Link href="/login" className="w-1/2">
                <PrimaryButton className="w-full">ログインページへ</PrimaryButton>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
