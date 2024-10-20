export type ArticleType = {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    description: string | null;
    created_at: string;
    categories: (string | undefined)[];
};
