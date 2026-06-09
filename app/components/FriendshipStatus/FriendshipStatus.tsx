import React, { memo } from 'react'
import { UserCheck, UserX, UserPlus, UserRoundX, UserRoundCheck } from 'lucide-react'
import { Friendship } from '@/lib/models/friendship'
import DynamicTooltip from '@/components/Tooltip/DynamicToolTip'
import LoadingButton from '@/components/LoadingButton/LoadingButton'
import { useFriendshipActions } from '@/hooks/useFriendshipActions'

type Props = {
    friendship: Friendship;
    userId: number;
    showText?: boolean;
}

const FriendshipStatus = memo(({ friendship: initialFriendship, userId, showText = true }: Props) => {
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

    if(!canBeFriend) return null;

    const iconSize = showText ? 16 : 15;
    const btnBase = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150";

    return (
        <div>
            {/* Rejected by other user */}
            {isRejectedByOtherUser && (
                <DynamicTooltip text="Friend request rejected" position="bottom">
                    <button type="button" className={`${btnBase}
                        bg-red-50 dark:bg-red-500/10 text-red-500
                        border border-red-100 dark:border-red-500/20
                        cursor-default
                    `}>
                        <UserX size={iconSize} />
                        {showText && <span>Rejected</span>}
                    </button>
                </DynamicTooltip>
            )}

            {/* Pending — sender */}
            {friendship.status === 'PENDING' && isCurrentUserSender && (
                <DynamicTooltip text="Click to unsend" position="bottom">
                    <button type="button" onClick={handleUnsendFriendRequest} className={`${btnBase}
                        bg-appPrimary/10 text-appPrimary border border-appPrimary/20
                        hover:bg-red-50 hover:text-red-500 hover:border-red-100
                        dark:hover:bg-red-500/10 dark:hover:border-red-500/20
                        group
                    `}>
                        <UserCheck size={iconSize} className="group-hover:hidden" />
                        <UserX size={iconSize} className="hidden group-hover:block" />
                        {showText && (
                            <>
                                <span className="group-hover:hidden">Request sent</span>
                                <span className="hidden group-hover:inline">Unsend</span>
                            </>
                        )}
                    </button>
                </DynamicTooltip>
            )}

            {/* Pending — receiver */}
            {friendship.status === 'PENDING' && !isCurrentUserSender && (
                <div className="flex items-center gap-2">
                    {showText && (
                        <span className="text-xs font-medium text-textSecondary/60 hidden sm:block">
                            Friend request
                        </span>
                    )}
                    <LoadingButton
                        className={`${btnBase}
                            bg-appPrimary text-white hover:opacity-90
                        `}
                        isLoading={isAcceptingFriendReq}
                        loaderColor="#ffffff"
                        loaderWidth={iconSize}
                        onClick={handleAcceptFriendRequest}
                        loadingText={showText ? "Accepting…" : undefined}
                        text={(
                            <span className="flex items-center gap-1.5">
                                <UserRoundCheck size={iconSize} />
                                {showText && "Accept"}
                            </span>
                        )}
                    />
                    <LoadingButton
                        className={`${btnBase}
                            bg-bgHoverSecondary text-textSecondary border border-borderPrimary
                            hover:bg-red-50 hover:text-red-500 hover:border-red-100
                            dark:hover:bg-red-500/10 dark:hover:border-red-500/20
                        `}
                        isLoading={isRejectingFriendReq}
                        loaderColor="#9691a5"
                        loaderWidth={iconSize}
                        onClick={handleRejectFriendRequest}
                        loadingText={showText ? "Declining…" : undefined}
                        text={(
                            <span className="flex items-center gap-1.5">
                                <UserRoundX size={iconSize} />
                                {showText && "Decline"}
                            </span>
                        )}
                    />
                </div>
            )}

            {/* Accepted */}
            {friendship.status === 'ACCEPTED' && (
                <DynamicTooltip text="Unfriend" position="bottom">
                    <button type="button" onClick={handleUnfriend} className={`${btnBase}
                        bg-bgHoverSecondary text-textSecondary border border-borderPrimary
                        hover:bg-red-50 hover:text-red-500 hover:border-red-100
                        dark:hover:bg-red-500/10 dark:hover:border-red-500/20
                        group
                    `}>
                        <UserCheck size={iconSize} className="group-hover:hidden" />
                        <UserX size={iconSize} className="hidden group-hover:block" />
                        {showText && (
                            <>
                                <span className="group-hover:hidden">Friends</span>
                                <span className="hidden group-hover:inline">Unfriend</span>
                            </>
                        )}
                    </button>
                </DynamicTooltip>
            )}

            {/* No relationship / rejected by current user */}
            {(friendship.status === null || isRejectedByCurrentUser) && (
                <DynamicTooltip text="Add friend" position="bottom">
                    <LoadingButton
                        className={`${btnBase}
                            bg-appPrimary text-white hover:opacity-90
                        `}
                        isLoading={isSendingFriendReq}
                        loaderColor="#ffffff"
                        loaderWidth={iconSize}
                        onClick={handleAddFriend}
                        text={(
                            <span className="flex items-center gap-1.5">
                                <UserPlus size={iconSize} />
                                {showText && "Add friend"}
                            </span>
                        )}
                    />
                </DynamicTooltip>
            )}
        </div>
    );
});

FriendshipStatus.displayName = 'FriendshipStatus';
export default FriendshipStatus;