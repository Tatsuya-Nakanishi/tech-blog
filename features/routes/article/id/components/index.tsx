"use client";

import { Heart, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Avatar from "@/components/common/Avatar";
import { useArticleDetail } from "../hooks";
import { ArticleType } from "@/types/article";
import { CommentType } from "@/types/comment";
import PrimaryButton from "@/components/common/PrimaryButton";
import Tag from "@/components/common/Tag";
import { format } from 'date-fns';
import { UserType } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

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
  isLiked
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
    isAlreadyLiked
  } = useArticleDetail(initialLikes, initialComments, article, user, isLiked);
  console.log(comments);
  return (
    <div className="md:w-2/3 md:pr-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
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
            className={`w-5 h-5 ${
              isAlreadyLiked ? "fill-current text-red-500" : ""
            }`}
          />
          <span>{likes}</span>
        </button>
      </div>
      <div className="mb-2 text-gray-500">{format(new Date(article.created_at), 'yyyy年MM月dd日')}</div>
      <div className="mb-6">
        <img
          src={article.image_url || ''}
          alt={article.title}
          className="w-full h-auto rounded-lg"
        />
      </div>
      <div className="mb-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">目次</h2>
        <ul className="space-y-1">
          {tableOfContents.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-gray-700 hover:text-gray-900 hover:underline"
              >
                <span className="border-b border-gray-300">
                  {item.text}
                </span>
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
        <h2 className="text-2xl font-bold mb-4">コメント</h2>
        {comments.length > 0 && comments.map((comment) => (
          <div key={comment.id} className="mb-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Avatar
                className="w-10 h-10 mr-3"
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
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            <p>{comment.content}</p>
          </div>
        ))}
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="コメントを入力してください"
            className="mb-2"
          />
          <PrimaryButton width="w-60" type="submit">
            コメントを投稿
          </PrimaryButton>
        </form>
      </div>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="bg-white p-6 max-w-sm mx-auto">
          <div className="flex flex-col items-center">
            <DialogHeader className="text-center mb-4">
              <DialogTitle className="text-xl font-semibold mb-2">ログインが必要です</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                いいねまたはコメントをするにはログインが必要です。<br />ログインページに移動しますか？
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center space-x-4 w-full mt-6">
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
