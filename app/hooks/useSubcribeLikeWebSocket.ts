import { useWebSocket } from "@/context/WebSocketContext";
import { decrementLikeCount, incrementLikeCount } from "@/redux/slices/postSlice";
import { incrementLikeCount as incrementCurrentUserLikeCount, decrementLikeCount as decrementCurrentUserLikeCount } from "@/redux/slices/currentUserSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useSubcribeLikeWebSocket(postId: number) {
    const dispatch = useDispatch();
    const { client, connected } = useWebSocket();

    useEffect(() => {
        if (connected && client) {
            const sub = client.subscribe(`/topic/${postId}/postLikes`, () => {
                dispatch(incrementLikeCount({postId}));
                dispatch(incrementCurrentUserLikeCount());
            });

            return () => sub.unsubscribe();
        }
    }, [connected, client, dispatch, postId]);

    useEffect(() => {
        if (connected && client) {
            const sub = client.subscribe(`/topic/${postId}/postDislikes`, () => {
                dispatch(decrementLikeCount({postId}));
                dispatch(decrementCurrentUserLikeCount());
            });

            return () => sub.unsubscribe();
        }
    }, [connected, client, dispatch, postId]);
}
