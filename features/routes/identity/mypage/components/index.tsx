'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import InputText from '@/components/common/InputText';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyPage } from '../hooks';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArticleType } from '@/types/article';
import { UserType } from '@/types/user';
import PrimaryButton from '@/components/common/PrimaryButton';
import { format } from 'date-fns';
import Link from 'next/link';

type MyPageProps = {
  user: UserType;
  likedArticles: ArticleType[];
  initialHasMore: boolean;
};

export default function MyPage({
  user,
  likedArticles: initialLikedArticles,
  initialHasMore,
}: MyPageProps) {
  const {
    userData,
    setUserData,
    likedArticles,
    handleProfileUpdate,
    handleFileChange,
    handleLoadMore,
    avatarPreview,
    hasMore,
    error,
  } = useMyPage(user, initialLikedArticles, initialHasMore);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleProfileUpdate}
              className="flex flex-col items-center space-y-4"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarPreview || ''} alt="ユーザーアイコン" />
                        <AvatarFallback>UN</AvatarFallback>
                      </Avatar>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ファイルを選択する</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="w-full max-w-sm space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">ニックネーム</Label>
                  <InputText
                    id="nickname"
                    value={userData?.nickname || ''}
                    onChange={(e) =>
                      setUserData({ ...userData, nickname: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <InputText id="email" value={userData?.email || ''} disabled />
                </div>
                <PrimaryButton type="submit">更新する</PrimaryButton>
                {error && <div className="text-center text-sm text-red-500">{error}</div>}
              </div>
            </form>
          </CardContent>
        </Card>

        <h2 className="mb-4 text-2xl font-bold">いいねした記事</h2>
        <div className="space-y-4">
          {likedArticles.length > 0 &&
            likedArticles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row">
                    <div className="mb-4 w-full flex-shrink-0 md:mb-0 md:mr-4 md:w-1/4">
                      <img
                        src={article.image_url || ''}
                        alt={article.title}
                        className="h-auto w-full rounded object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="mb-2 text-xl font-semibold">
                        <Link
                          href={`/article/${article.id}`}
                          className="hover:text-purple-600"
                        >
                          {article.title}
                        </Link>
                      </h3>
                      <p className="mb-2 text-sm text-gray-500">
                        {format(new Date(article.created_at), 'yyyy年MM月dd日')}
                      </p>
                      <div className="mb-2">
                        {article.categories.map((tag) => (
                          <span
                            key={tag}
                            className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700">{article.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <PrimaryButton onClick={handleLoadMore}>もっと見る</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
