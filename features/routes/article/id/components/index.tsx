"use client";

import SideMenu from "@/features/common/SideMenu/components";
import { Heart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Avatar from "@/components/common/Avatar";
import { useArticleDetail } from "../hooks";
import { ArticleType } from "@/types/article";
import { CommentType } from "@/types/comment";
import PrimaryButton from "@/components/common/PrimaryButton";
import Tag from "@/components/common/Tag";

type ArticleDetailProps = {
  article: ArticleType;
  initialLikes: number;
  initialComments: CommentType[];
};

export default function Component({
  article,
  initialLikes,
  initialComments,
}: ArticleDetailProps) {
  const {
    likes,
    handleLike,
    comments,
    newComment,
    setNewComment,
    handleCommentSubmit,
    tableOfContents,
  } = useArticleDetail(initialLikes, initialComments, article);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <main className="md:w-2/3 md:pr-8">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex space-x-2">
              {article.tags.map((tag, index) => (
                <Tag key={index}>#{tag}</Tag>
              ))}
            </div>
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
            >
              <Heart
                className={`w-5 h-5 ${
                  likes > 0 ? "fill-current text-red-500" : ""
                }`}
              />
              <span>{likes}</span>
            </button>
          </div>
          <div className="mb-2 text-gray-500">{article.date}</div>
          <div className="mb-6">
            <img
              src={article.imageUrl}
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
            dangerouslySetInnerHTML={{ __html: article.summary }}
            className="prose"
          />
          {/* コメントセクション */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">コメント</h2>
            {comments.map((comment) => (
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
        </main>
        <SideMenu />
      </div>
    </div>
  );
}
