import { PostComment } from '@/lib/models/comment';
import { Post } from '@/lib/models/post';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Post[] = [];

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<Post>) => {
            state.unshift(action.payload);
        },
        addPosts: (state, action: PayloadAction<Post[]>) => {
            const existingPostIds = new Set(state.map(post => post.id));
            const newPosts = action.payload.filter(post => !existingPostIds.has(post.id));
            state.push(...newPosts);
        },
        deletePost: (state, action: PayloadAction<number>) => {
            const index = state.findIndex(post => post.id == action.payload);
            if(index === -1) return;
            state.splice(index, 1);
        },
        updatePost: (state, action: PayloadAction<{
            postId: number,
            content: string,
            title: string
        }>) => {
            const post = state.find(post => post.id === action.payload.postId);
            if (post) {
                post.title = action.payload.title;
                post.content = action.payload.content;
            }
        },
        sendComment: (state, action: PayloadAction<{
            postId: number,
            comment: PostComment
        }>) => {
            const post = state.find(post => post.id === action.payload.postId);
            if (post) {
                post.comments.unshift(action.payload.comment);
                post.commentCount++;
            }
        },
        addComments: (state, action: PayloadAction<{
            postId: number,
            comments: PostComment[]
        }>) => {
            const post = state.find(post => post.id === action.payload.postId);
            if (post) {
                const existingCommentIds = new Set(post.comments.map(comment => comment.id));

                const newComments = action.payload.comments.filter(comment => 
                    !existingCommentIds.has(comment.id)
                );

                post.comments.push(...newComments);
            }
        },
        incrementLikeCount: (state, action: PayloadAction<{
            postId: number
        }>) => {
            const post = state.find(post => post.id === action.payload.postId);
            if (post) {
                post.likeCount++;
            }
        },
        decrementLikeCount: (state, action: PayloadAction<{
            postId: number
        }>) => {
            const post = state.find(post => post.id === action.payload.postId && post.likeCount > 0);
            if (post) {
                post.likeCount--;
            }
        },
        setPosts: (state, action: PayloadAction<Post[]>) => action.payload,
    },
});

export const { addPost, addPosts, deletePost, setPosts, addComments, sendComment, updatePost, incrementLikeCount, decrementLikeCount } = postSlice.actions;
export default postSlice.reducer;
