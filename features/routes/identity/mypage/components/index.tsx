"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyPage } from "../hooks";
import { ArticleType } from "@/types/article";
import { UserType } from "@/types/user";
import PrimaryButton from "@/components/common/PrimaryButton";

type MyPageProps = {
  user: UserType;
  likedArticles: ArticleType[];
};

export default function MyPage({
  user,
  likedArticles: initialLikedArticles,
}: MyPageProps) {
  const {
    userData,
    setUserData,
    likedArticles,
    handleUpdate,
    handleLoadMore,
    hasLoadedMore,
  } = useMyPage(user, initialLikedArticles);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.icon} alt="ユーザーアイコン" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="w-full max-w-sm space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">ニックネーム</Label>
                  <Input
                    id="nickname"
                    value={userData.nickname}
                    onChange={(e) =>
                      setUserData({ ...userData, nickname: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input id="email" value={userData.email} disabled />
                </div>
                <PrimaryButton onClick={handleUpdate}>更新する</PrimaryButton>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">いいねした記事</h2>
        <div className="space-y-4">
          {likedArticles.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-shrink-0 w-full md:w-1/4 mb-4 md:mb-0 md:mr-4">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-auto object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                    <div className="mb-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700">{article.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {!hasLoadedMore && (
          <div className="flex justify-center mt-8">
            <PrimaryButton onClick={handleLoadMore}>もっと見る</PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
