import ArticleDetail from "@/features/routes/article/id/components/index";
import { ArticleType } from "@/types/article";
import { CommentType } from "@/types/comment";

export default function Page() {
  // ここで記事IDを取得（実際にはルーティングから取得します）
  const articleId = 1; // 仮のID

  // データをフェッチする想定（モックデータを使用）
  const sampleArticle: ArticleType = {
    id: articleId,
    title: "Container / Presentational構成 【Reactのコンポーネント設計】",
    date: "2021.8.15",
    tags: ["React", "Next.js"],
    summary: `
    <h1 id="heading-1" class="text-2xl font-bold mb-4 p-2 bg-blue-100 rounded">Reactのコンポーネント</h1>
    <p>Reactのコンポーネント設計は重要なトピックです。適切な設計を行うことで、保守性の高いアプリケーションを構築することができます。</p>
    
    <h1 id="heading-2" class="text-2xl font-bold mb-4 mt-8 p-2 bg-blue-100 rounded">Container / Presentational構成</h1>
    <p>Container/Presentational構成は、Reactアプリケーションの設計パターンの一つです。この構成では、コンポーネントを以下の2つに分類します：</p>
    <ul class="list-disc pl-6 mb-4">
      <li>Container Components</li>
      <li>Presentational Components</li>
    </ul>
    
    <h1 id="heading-3" class="text-2xl font-bold mb-4 mt-8 p-2 bg-blue-100 rounded">Container Components</h1>
    <p>Container Componentsは、データの取得やロジックの処理を担当するコンポーネントです。主な特徴は以下の通りです：</p>
    <ul class="list-disc pl-6 mb-4">
      <li>データの取得と状態管理を行う</li>
      <li>Presentational Componentsにデータを渡す</li>
      <li>ロジックを含むが、UIをほとんど持たない</li>
    </ul>
    
    <h1 id="heading-4" class="text-2xl font-bold mb-4 mt-8 p-2 bg-blue-100 rounded">Presentational Components</h1>
    <p>Presentational Componentsは、UIの見た目を担当するコンポーネントです。主な特徴は以下の通りです：</p>
    <ul class="list-disc pl-6 mb-4">
      <li>UIのレンダリングに集中する</li>
      <li>propsを通じてデータを受け取る</li>
      <li>状態を持たない（UIの状態は除く）</li>
    </ul>
    
    <h1 id="heading-5" class="text-2xl font-bold mb-4 mt-8 p-2 bg-blue-100 rounded">実装例</h1>
    <p>以下は、Container ComponentとPresentational Componentの簡単な実装例です：</p>
    <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code class="language-jsx">
// Container Component
import React, { useState, useEffect } from 'react';
import UserList from './UserList';

const UserListContainer = () => {
const [users, setUsers] = useState([]);

useEffect(() => {
  // APIからユーザーデータを取得
  fetchUsers().then(data => setUsers(data));
}, []);

return <UserList users={users} />;
};

// Presentational Component
const UserList = ({ users }) => (
<ul>
  {users.map(user => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>
);
    </code></pre>
    
    <h1 id="heading-6" class="text-2xl font-bold mb-4 mt-8 p-2 bg-blue-100 rounded">まとめ</h1>
    <p>Container/Presentational構成を適切に使用することで、コンポーネントの責務を明確に分離し、再利用性と保守性の高いReactアプリケーションを構築することができます。</p>
  `,
    imageUrl: "https://future-architect.github.io/images/20240228a/top.jpg",
  };

  const initialLikes = 0;

  const initialComments: CommentType[] = [
    {
      id: 1,
      author: "ユーザー1",
      avatar: "/placeholder.svg",
      date: "2023/05/01",
      content: "とても参考になる記事です！",
    },
    {
      id: 2,
      author: "ユーザー2",
      avatar: "/placeholder.svg",
      date: "2023/05/02",
      content: "Container/Presentational構成について理解が深まりました。",
    },
  ];

  return (
    <ArticleDetail
      article={sampleArticle}
      initialLikes={initialLikes}
      initialComments={initialComments}
    />
  );
}
