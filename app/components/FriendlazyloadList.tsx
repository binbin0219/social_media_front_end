import {
    IconCheck,
    IconAlertCircle,
    IconUserOff,
    IconSearch,
} from '@tabler/icons-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import UserIcon from './UserIcon/UserIcon';
import DataLoader from './DataLoader/DataLoader';
import DropdownItemSkeleton from './Skeletons/DropdownItemSkeleton';
import { apiAgent } from '@/lib/api-agent';
import { Media } from '@/lib/models/Media';

export type FriendDTO = {
    id: number;
    username: string;
    updatedAt?: string;
    avatar?: Media | null;
    background?: Media | null;
};

type Props = {
    userId: number;
    selectedIds: number[];
    onToggle: (friend: FriendDTO) => void;
    className?: string;
    length?: number;
};

const FriendLazyLoadList = ({
    userId,
    className,
    onToggle,
    selectedIds,
    length = 10,
}: Props) => {
    const [friends, setFriends] = useState<FriendDTO[]>([]);
    const [isAllFetched, setIsAllFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    // debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    // reset list when search changes
    useEffect(() => {
        setFriends([]);
        setIsAllFetched(false);
        setError(null);
    }, [debouncedSearch]);

    const handleDataLoaderVisible = useCallback(async () => {
        if (isLoading || isAllFetched) return;

        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams({
                start: String(friends.length),
                length: String(length),
                status: "ACCEPTED"
            });

            if (debouncedSearch.trim()) {
                params.append('username', debouncedSearch.trim());
            }

            const res = await apiAgent.fetchOnClient(
                `/api/friendship/${userId}/friends?${params.toString()}`
            );

            if (!res.ok) {
                throw new Error(`Failed to fetch friends (${res.status})`);
            }

            const data = await res.json();

            const newFriends: FriendDTO[] = data.data ?? [];

            const unique = newFriends.filter(
                (nf) => !friends.some((f) => f.id === nf.id)
            );

            if (!mountedRef.current) return;

            setFriends((prev) => [...prev, ...unique]);

            if (newFriends.length < length) {
                setIsAllFetched(true);
            }
        } catch (err) {
            console.error(err);

            if (!mountedRef.current) return;

            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong'
            );
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [
        debouncedSearch,
        friends,
        isAllFetched,
        isLoading,
        length,
        userId,
    ]);

    const NoResults = () => (
        <div className="flex flex-col items-center gap-1 p-4 text-textPrimary/40">
            <IconUserOff size={20} />
            <p className="text-xs">
                {debouncedSearch
                    ? 'No matching users found'
                    : 'No friends found'}
            </p>
        </div>
    );

    const ErrorState = () => (
        <div className="flex flex-col items-center gap-2 p-4 text-red-400">
            <IconAlertCircle size={20} />
            <p className="text-xs text-center">{error}</p>

            <button
                onClick={handleDataLoaderVisible}
                className="text-xs px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className={className}>
            {/* Search Input */}
            <div className="relative mb-3">
                <IconSearch
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-textPrimary/40"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search username..."
                    className="
                        w-full pl-9 pr-3 py-2 rounded-lg
                        bg-bgPrimary border border-borderPrimary
                        text-sm text-textPrimary
                        outline-none transition
                        focus:border-appPrimary
                    "
                />
            </div>

            {isAllFetched && friends.length === 0 && !error && <NoResults />}

            <div className="flex flex-col gap-1">
                {friends.map((friend) => {
                    const isSelected = selectedIds.includes(friend.id);

                    return (
                        <div
                            key={friend.id}
                            onClick={() => onToggle(friend)}
                            className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                                transition-all duration-150 select-none
                                ${
                                    isSelected
                                        ? 'bg-appPrimary/10 border border-appPrimary'
                                        : 'hover:bg-bgPrimary'
                                }
                            `}
                        >
                            <UserIcon
                                width={36}
                                height={36}
                                userId={friend.id}
                                avatarUrl={friend.avatar?.url}
                            />

                            <span className="text-sm text-textPrimary flex-1">
                                {friend.username}
                            </span>

                            <div
                                className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    transition-all duration-150 shrink-0
                                    ${
                                        isSelected
                                            ? 'bg-appPrimary border-appPrimary'
                                            : 'border-borderPrimary'
                                    }
                                `}
                            >
                                {isSelected && (
                                    <IconCheck
                                        size={11}
                                        className="text-white"
                                        strokeWidth={3}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {error && <ErrorState />}

            {!isAllFetched && !error && (
                <DataLoader onVisible={handleDataLoaderVisible}>
                    <div className="flex flex-col gap-2 px-1">
                        <DropdownItemSkeleton />
                        <DropdownItemSkeleton />
                        <DropdownItemSkeleton />
                    </div>
                </DataLoader>
            )}
        </div>
    );
};

export default FriendLazyLoadList;
