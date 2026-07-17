import PostForm from "../../components/PostForm";

export default function PostPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] p-6">
            <h1 className="text-xl font-bold mb-6">投稿ページ</h1>
            <PostForm />
        </main>
    );
}
