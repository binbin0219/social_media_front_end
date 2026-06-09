import { Dispatch, ReactNode, SetStateAction } from "react"
import FriendLazyLoadList, { FriendDTO } from "../FriendlazyloadList"
import UserIcon from "../UserIcon/UserIcon"
import { IconX } from "@tabler/icons-react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

type Props = {
    icon: ReactNode,
    header: string,
    hint: string,
    selectedFriends: FriendDTO[],
    setSelectedFriends: Dispatch<SetStateAction<FriendDTO[]>>,
    friendListKey: number,
}

export default function FriendSelector({
    icon,
    header,
    hint,
    selectedFriends,
    setSelectedFriends,
    friendListKey,
}: Props) {
    const currentUser = useSelector((state: RootState) => state.currentUser);

    const handleFriendToggle = (friend: FriendDTO) => {
        setSelectedFriends((prev) =>
            prev.some((f) => f.id === friend.id)
                ? prev.filter((f) => f.id !== friend.id)
                : [...prev, friend]
        );
    };

    const handleRemoveFriend = (id: number) => {
        setSelectedFriends((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <div className="rounded-xl ring-1 ring-borderPrimary bg-bgSecondary overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-borderPrimary/60">
                <span className="text-appPrimary">{icon}</span>
                <span className="text-xs font-semibold text-textPrimary/70 uppercase tracking-widest">
                    {header}
                </span>
                {selectedFriends.length > 0 && (
                    <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-appPrimary/10 text-appPrimary">
                        {selectedFriends.length} selected
                    </span>
                )}
            </div>

            {/* Selected chips */}
            {selectedFriends.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 pt-3">
                    {selectedFriends.map((friend) => (
                        <div
                            key={friend.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-appPrimary/10 border border-appPrimary text-xs text-appPrimary font-medium"
                        >
                            <UserIcon width={18} height={18} userId={friend.id} updatedAt={friend.updatedAt} />
                            <span>{friend.username}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveFriend(friend.id)}
                                className="ml-0.5 text-appPrimary/60 hover:text-appPrimary transition-colors"
                            >
                                <IconX size={11} strokeWidth={2.5} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Hint */}
            <p className="text-[11px] text-textPrimary/30 px-4 pt-3 pb-1">
                {hint}
            </p>

            {/* Friend list */}
            <FriendLazyLoadList
                key={friendListKey}
                userId={currentUser!.id}
                selectedIds={selectedFriends.map((f) => f.id)}
                onToggle={handleFriendToggle}
                className="px-3 pb-3 max-h-60 overflow-y-auto flex flex-col gap-0.5"
                length={10}
            />
        </div>
    )
}