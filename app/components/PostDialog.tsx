import { Post as PostType} from "@/lib/models/post";
import Dialog from "./Dialog";
import Post from "./Post/Post";

type Props = {
    post: PostType;
    isOpen: boolean;
    showCloseBtn?: boolean;
    onClose: () => void;
    handleAddPost: (newPost: PostType) => void;
    handleEditPost: (newPost: PostType) => void;
    handleDeletePost: (postId: Number) => void;
}

export default function PostDialog({ post, isOpen, showCloseBtn, onClose, handleAddPost, handleEditPost, handleDeletePost }: Props) {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} showCloseBtn={showCloseBtn}>
            <div className="max-h-[800px] w-[80vh] max-w-[1000px]">
                <Post 
                    post={post} 
                    alwaysOpenCommentSection={true}
                    handleAddPost={handleAddPost} 
                    handleEditPost={handleEditPost} 
                    handleDeletePost={handleDeletePost} />
            </div>
        </Dialog>
    )
}