import { useWebSocket } from "@/context/WebSocketContext";
import { PostComment } from "@/lib/models/comment";
import { sendComment } from "@/redux/slices/postSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useSubcribeCommentWebSocket(postId: number) {
    const dispatch = useDispatch(); // invoke the hook
    const currentUserId = useSelector((state: RootState) => state.currentUser?.id)!;
    const { client, connected } = useWebSocket();

    useEffect(() => {
        if (connected && client) {
            const sub = client.subscribe(`/topic/${postId}/postComments`, (msg) => {
                const comment: PostComment = JSON.parse(msg.body);
                if(comment.user?.id === currentUserId) return; // Skip add comment if is current user's comment
                dispatch(sendComment({ postId, comment : comment }));
            });

            return () => sub.unsubscribe();
        }
    }, [connected, client, dispatch, postId, currentUserId]);
}
