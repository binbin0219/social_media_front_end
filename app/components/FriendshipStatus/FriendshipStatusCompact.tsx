import React, { memo } from 'react'
import { UserCheck, UserX, UserPlus, UserRoundX, UserRoundCheck } from 'lucide-react'
import { Friendship } from '@/lib/models/friendship'
import DynamicTooltip from '@/components/Tooltip/DynamicToolTip'
import LoadingButton from '@/components/LoadingButton/LoadingButton'
import { useFriendshipActions } from '@/hooks/useFriendshipActions'

type Props = {
    friendship?: Friendship;
    userId: number;
}

const FriendshipStatusCompact = memo(({ friendship: initialFriendship, userId }: Props) => {
    const {
        friendship,
        canBeFriend,
        isCurrentUserSender,
        isRejectedByCurrentUser,
        isRejectedByOtherUser,
        isSendingFriendReq,
        isAcceptingFriendReq,
        isRejectingFriendReq,
        handleAddFriend,
        handleUnsendFriendRequest,
        handleAcceptFriendRequest,
        handleRejectFriendRequest,
        handleUnfriend,
    } = useFriendshipActions(userId, initialFriendship);

    const iconBtn = "w-7 h-7 flex items-center justify-center rounded-md transition-colors duration-150";

    if(!canBeFriend) return null;

    return (
        <div className="flex items-center gap-1">

            {/* Rejected by other user */}
            {isRejectedByOtherUser && (
                <DynamicTooltip text="Friend request rejected" position="bottom">
                    <button type="button" className={`${iconBtn} text-red-400 cursor-default`}>
                        <UserX size={14} />
                    </button>
                </DynamicTooltip>
            )}

            {/* Pending — sender */}
            {friendship.status === 'PENDING' && isCurrentUserSender && (
                <DynamicTooltip text="Unsend friend request" position="bottom">
                    <button type="button" onClick={handleUnsendFriendRequest} className={`${iconBtn}
                        text-appPrimary
                        hover:bg-red-50 hover:text-red-500
                        dark:hover:bg-red-500/10
                        group
                    `}>
                        <UserCheck size={14} className="group-hover:hidden" />
                        <UserX size={14} className="hidden group-hover:block" />
                    </button>
                </DynamicTooltip>
            )}

            {/* Pending — receiver */}
            {friendship.status === 'PENDING' && !isCurrentUserSender && (
                <>
                    <DynamicTooltip text="Accept" position="bottom">
                        <LoadingButton
                            className={`${iconBtn} text-appPrimary hover:bg-appPrimary/10`}
                            isLoading={isAcceptingFriendReq}
                            loaderColor="var(--app-color-primary)"
                            loaderWidth={14}
                            onClick={handleAcceptFriendRequest}
                            text={<UserRoundCheck size={14} />}
                        />
                    </DynamicTooltip>
                    <DynamicTooltip text="Decline" position="bottom">
                        <LoadingButton
                            className={`${iconBtn}
                                text-textSecondary/50
                                hover:bg-red-50 hover:text-red-500
                                dark:hover:bg-red-500/10
                            `}
                            isLoading={isRejectingFriendReq}
                            loaderColor="#9691a5"
                            loaderWidth={14}
                            onClick={handleRejectFriendRequest}
                            text={<UserRoundX size={14} />}
                        />
                    </DynamicTooltip>
                </>
            )}

            {/* Accepted */}
            {friendship.status === 'ACCEPTED' && (
                <DynamicTooltip text="Unfriend" position="bottom">
                    <button type="button" onClick={handleUnfriend} className={`${iconBtn}
                        text-green-500
                        hover:bg-red-50 hover:text-red-500
                        dark:hover:bg-red-500/10
                        group
                    `}>
                        <UserCheck size={14} className="group-hover:hidden" />
                        <UserX size={14} className="hidden group-hover:block" />
                    </button>
                </DynamicTooltip>
            )}

            {/* No relationship / rejected by current user */}
            {(friendship.status === null || isRejectedByCurrentUser) && (
                <DynamicTooltip text="Add friend" position="bottom">
                    <LoadingButton
                        className={`${iconBtn} text-textSecondary/50 hover:bg-appPrimary/10 hover:text-appPrimary`}
                        isLoading={isSendingFriendReq}
                        loaderColor="var(--app-color-primary)"
                        loaderWidth={14}
                        onClick={handleAddFriend}
                        text={<UserPlus size={14} />}
                    />
                </DynamicTooltip>
            )}
        </div>
    );
});

FriendshipStatusCompact.displayName = 'FriendshipStatusCompact';
export default FriendshipStatusCompact;