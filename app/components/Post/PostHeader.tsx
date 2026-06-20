import { Post } from "@/lib/models/post";
import UserIcon from "../UserIcon/UserIcon";
import { useRouter } from "next/navigation";
import { User } from "@/lib/models/user";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DynamicTooltip from "../Tooltip/DynamicToolTip";
import PrivacyBadge from "./PrivacyBadge";
import FriendshipStatusCompact from "../FriendshipStatus/FriendshipStatusCompact";

type Props = {
    post: Post;
    size?: 'default' | 'sm';
    className?: string;
}

export default function PostHeader({ post, size = 'default', className = '' }: Props) {
    const router = useRouter();
    const currentUser: User = useSelector((state: RootState) => state.currentUser);
    const author = post?.user;
    const isCurrentUserAuthor = currentUser?.id === post?.user?.id;
    const isSmall = size === 'sm';

    return (
        <div className={`flex gap-1 cursor-pointer items-center w-fit ${className}`}>
            <UserIcon
                userId={author!.id}
                updatedAt={author?.updatedAt}
                width={isSmall ? 30 : undefined}
                height={isSmall ? 30 : undefined}
            />

            <div className="flex flex-col">
                <div className="flex items-center">
                    <h4
                        onClick={(e) => (e.stopPropagation(), router.push(`/user/profile/${author?.id}`))}
                        className={`font-bold hover:underline text-textPrimary ${isSmall ? 'text-sm' : ''}`}
                    >
                        {author?.username ?? "Unknown"}{' '}
                        {isCurrentUserAuthor ? '(You)' : ''}
                    </h4>
                    <FriendshipStatusCompact
                        friendship={post.friendship}
                        userId={post.user!.id}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <DynamicTooltip
                        className="w-fit"
                        text={new Date(post.createdAt).toLocaleString()}
                    >
                        <h6 className={`text-textSecondary hover:underline ${isSmall ? 'text-xs' : 'text-sm'}`}>
                            {timeAgo(post.createdAt)}
                        </h6>
                    </DynamicTooltip>
                    <PrivacyBadge
                        privacy={post.privacySetting}
                        isAuthor={isCurrentUserAuthor}
                    />
                </div>
            </div>
        </div>
    );
}