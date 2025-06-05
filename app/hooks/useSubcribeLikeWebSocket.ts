import { useWebSocket } from "@/context/WebSocketContext";
import { decrementLikeCount, incrementLikeCount } from "@/redux/slices/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useSubcribeLikeWebSocket(postId: number) {
    const dispatch = useDispatch();
    const { client, connected } = useWebSocket();

    useEffect(() => {
        if (connected && client) {
            const sub = client.subscribe(`/topic/${postId}/postLikes`, () => {
                dispatch(incrementLikeCount({postId}));
            });

            return () => sub.unsubscribe();
        }
    }, [connected, client, dispatch, postId]);

    useEffect(() => {
        if (connected && client) {
            const sub = client.subscribe(`/topic/${postId}/postDislikes`, () => {
                dispatch(decrementLikeCount({postId}));
            });

            return () => sub.unsubscribe();
        }
    }, [connected, client, dispatch, postId]);
}
