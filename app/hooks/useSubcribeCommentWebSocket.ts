import { useWebSocket } from "@/context/WebSocketContext";
import { createComment } from "@/redux/slices/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useSubcribeCommentWebSocket(postId: number) {
    const dispatch = useDispatch(); // invoke the hook
    const { client, connected } = useWebSocket();

    useEffect(() => {
        if (connected && client) {
            const sub = client.subscribe(`/topic/${postId}/postComments`, (msg) => {
                const comment = JSON.parse(msg.body);
                dispatch(createComment({ postId, comment : comment }));
            });

            return () => sub.unsubscribe();
        }
    }, [connected, client, dispatch, postId]);
}
