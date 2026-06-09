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
}

export default function PostHeader({ post }: Props) {
    const router = useRouter();
    const currentUser : User = useSelector((state: RootState) => state.currentUser);
    const author = post?.user;
    const isCurrentUserAuthor = currentUser?.id === post?.user?.id;

    return (
        <div className="flex gap-1 cursor-pointer">
            <UserIcon
                userId={author!.id}
                updatedAt={author?.updatedAt}
            />

            <div className="flex flex-col">
                <div className="flex items-center">
                    <h4
                        onClick={() =>
                            router.push(`/user/profile/${author?.id}`)
                        }
                        className="font-bold hover:underline text-textPrimary"
                    >
                        {author?.username ?? "Unknown"}{' '}
                        {isCurrentUserAuthor ? '(You)' : ''}
                    </h4>
                    <FriendshipStatusCompact friendship={post.friendship} userId={post.user!.id}/>
                </div>

                <div className="flex items-center gap-2">
                    <DynamicTooltip
                        className="w-fit"
                        text={new Date(post.create_at).toLocaleString()}
                    >
                            <h6 className="text-sm text-textSecondary hover:underline">
                                {timeAgo(post.create_at)}
                            </h6>

                    </DynamicTooltip>
                    <PrivacyBadge privacy={post.privacySetting} isAuthor={isCurrentUserAuthor} />
                </div>
            </div>
        </div>
    )
}