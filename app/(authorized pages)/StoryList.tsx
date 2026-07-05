'use client'

import { useCallback, useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { useSelector } from 'react-redux'
import DataLoader from '@/components/DataLoader/DataLoader'
import CreateStoryDialog from '@/components/CreateStoryDialog/CreateStoryDialog'
import SmartImage from '@/components/SmartImage'
import { RootState } from '@/redux/store'
import { useStoryViewer } from '@/context/StoryViewerContext'
import { apiAgent } from '@/lib/api-agent'
import { FriendStory } from '@/lib/models/FriendStory'
import { Story } from '@/lib/models/Story'
import { PaginatedResponse } from '@/lib/models/PaginatedResponse'
import { defaultUserAvatar } from '@/lib/constants'

// ---- helpers ----
const STORY_PAGE_SIZE = 10
const STORY_AVATAR_SIZE = 64
const AVATAR_COLORS = [
  '#7C3AED',
  '#EC4899',
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#EF4444',
]

function avatarColor(userId: number) {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length]
}

function normalizeStory(story: Story): Story {
  return {
    ...story,
    media: {
      id: story.media.id,
      url: story.media.url,
      mimeType: story.media.mimeType,
    },
  }
}

function normalizeFriendStories(friendStories: FriendStory): FriendStory {
  return {
    user: friendStories.user,
    stories: friendStories.stories.map(normalizeStory),
  }
}

type StoryAvatarButtonProps = {
  friendStory: FriendStory
  onClick: () => void
}

function StoryAvatarButton({ friendStory, onClick }: StoryAvatarButtonProps) {
  const { user, stories } = friendStory
  const allSeen = stories.every((story) => story.isViewed)
  const color = avatarColor(user.id)

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full transition-opacity hover:opacity-70"
      style={{
        width: STORY_AVATAR_SIZE,
        height: STORY_AVATAR_SIZE,
        background: allSeen
          ? '#9CA3AF'
          : `conic-gradient(${color}, #EC4899, ${color})`,
        padding: 2.5,
      }}
      aria-label={`View ${user.username}'s story`}
    >
      <span
        className="flex h-full w-full items-center justify-center overflow-hidden rounded-full"
        style={{ border: '2.5px solid var(--bg-secondary)' }}
      >
        <SmartImage
          className="rounded-full"
          src={user.avatar?.url ?? ''}
          fallbackSrc={defaultUserAvatar}
          width="100%"
          height="100%"
          alt={`${user.username}'s avatar`}
        />
      </span>
    </button>
  )
}

// ---- main component ----
export default function StoryList() {
  const currentUser = useSelector((state: RootState) => state.currentUser)
  const { openStoryViewer, closeStoryViewer } = useStoryViewer()
  const [friendStories, setFriendStories] = useState<FriendStory[]>([])
  const [storyPage, setStoryPage] = useState(0)
  const [isAllStoryFetched, setIsAllStoryFetched] = useState(false)
  const [isFetchStoryFailed, setIsFetchStoryFailed] = useState(false)
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false)

  const fetchStories = useCallback(async () => {
    const response = await apiAgent.fetchOnClient(`/api/story/friends?page=${storyPage}&size=${STORY_PAGE_SIZE}`, {
      method: 'GET',
    })

    if (!response.ok) throw new Error('Failed to fetch stories')

    const responseData = await response.json() as PaginatedResponse<FriendStory>
    return {
      friendStories: responseData.data.map(normalizeFriendStories),
      isLastPage: storyPage * STORY_PAGE_SIZE + responseData.data.length >= responseData.total,
    }
  }, [storyPage])

  const handleDataLoaderVisible = async () => {
    setTimeout(() => {
      fetchStories()
        .then(({ friendStories: newFriendStories, isLastPage }) => {
          setFriendStories((prev) => [...prev, ...newFriendStories])
          setStoryPage((page) => page + 1)
          if (isLastPage) setIsAllStoryFetched(true)
        })
        .catch((error) => {
          console.log(error)
          setIsFetchStoryFailed(true)
        })
    }, 500)
  }

  const handleStoryCreated = (story: Story) => {
    const storyUser = story.user ?? currentUser
    if (!storyUser) return

    setFriendStories((prev) => {
      const existingFriendStoryIndex = prev.findIndex((fs) => fs.user?.id === storyUser.id)

      if (existingFriendStoryIndex === -1) {
        return [
          {
            user: storyUser,
            stories: [story],
          },
          ...prev,
        ]
      }

      return prev.map((friendStory, index) => (
        index === existingFriendStoryIndex
          ? {
              ...friendStory,
              stories: [...friendStory.stories, story],
            }
          : friendStory
      ))
    })
  }

  const handleStoryMarkedViewed = useCallback((storyId: number) => {
    setFriendStories((prev) => (
      prev.map((friendStory) => ({
        ...friendStory,
        stories: friendStory.stories.map((story) => (
          story.id === storyId
            ? { ...story, isViewed: true }
            : story
        )),
      }))
    ))
  }, [])

  const openFriendStory = useCallback((friendIdx: number, initialStoryIdx: number | null = null) => {
    const friendStory = friendStories[friendIdx]
    if (!friendStory) return

    openStoryViewer({
      user: friendStory.user,
      stories: friendStory.stories,
      initialStoryIdx,
      onStoryMarkedViewed: handleStoryMarkedViewed,
      onFinished: () => {
        const nextIdx = friendIdx + 1

        if (nextIdx < friendStories.length) {
          openFriendStory(nextIdx)
          return
        }

        closeStoryViewer()
      },
      onPreviousUser: () => {
        const previousIdx = friendIdx - 1
        if (previousIdx < 0) return

        const previousStoryIdx = Math.max((friendStories[previousIdx]?.stories.length ?? 1) - 1, 0)
        openFriendStory(previousIdx, previousStoryIdx)
      },
    })
  }, [closeStoryViewer, friendStories, handleStoryMarkedViewed, openStoryViewer])

  return (
    <>
      {/* scroll rail */}
      <div
        className="flex gap-3 overflow-x-auto py-3"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* create card */}
        <button
          onClick={() => setIsCreateStoryOpen(true)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              border: '1.5px dashed var(--border-primary)',
            }}
          >
            <IconPlus size={24} className="text-appPrimary" />
          </div>
          <span className="text-xs text-textPrimary text-center w-20 truncate">
            Your story
          </span>
        </button>

        {/* friend story cards */}
        {!isFetchStoryFailed &&
          friendStories.map((fs, idx) => (
            <div
              key={fs.user.id}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20"
            >
              <StoryAvatarButton
                friendStory={fs}
                onClick={() => openFriendStory(idx)}
              />
              <span className="text-xs text-textPrimary text-center w-20 truncate">
                {fs.user.username}
              </span>
            </div>
          ))}

        {isFetchStoryFailed ? (
          <p className="text-xs font-bold text-textSecondary self-center">
            Failed to load stories
          </p>
        ) : (
          !isAllStoryFetched && (
            <DataLoader
              className="flex gap-3 flex-shrink-0"
              onVisible={handleDataLoaderVisible}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20">
                  <div
                    className="w-16 h-16 rounded-full animate-pulse"
                    style={{ background: 'var(--skeleton-base)' }}
                  />
                  <div
                    className="h-2.5 w-14 rounded animate-pulse"
                    style={{ background: 'var(--skeleton-base)' }}
                  />
                </div>
              ))}
            </DataLoader>
          )
        )}
      </div>

      <CreateStoryDialog
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onStoryCreated={handleStoryCreated}
      />
    </>
  )
}
