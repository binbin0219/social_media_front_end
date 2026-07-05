'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { IconEye, IconX } from '@tabler/icons-react'
import DataLoader from '@/components/DataLoader/DataLoader'
import Dialog from '@/components/Dialog'
import SmartImage from '@/components/SmartImage'
import UserIcon from '@/components/UserIcon/UserIcon'
import { apiAgent } from '@/lib/api-agent'
import { Story } from '@/lib/models/Story'
import { StoryViewer as StoryViewerModel } from '@/lib/models/StoryViewer'
import { PaginatedResponse } from '@/lib/models/PaginatedResponse'
import { StoryUser } from '@/lib/models/user'
import { mergeByKey } from '@/utils/helpers'

type Props = {
  isOpen: boolean
  user: StoryUser | null
  stories: Story[]
  initialStoryIdx?: number | null
  onClose: () => void
  onFinished?: () => void
  onPreviousUser?: () => void
  onStoryMarkedViewed?: (storyId: number) => void
  currentUserId?: number
}

const AVATAR_COLORS = [
  '#7C3AED', '#EC4899', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444',
]
const VIEWER_PAGE_SIZE = 10

function avatarColor(userId: number) {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length]
}

function ViewerSkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2 py-1">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-2 py-1.5">
          <div className="skeleton h-7 w-7 shrink-0 rounded-full opacity-70" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div
              className="skeleton h-3 rounded opacity-70"
              style={{ width: index % 2 === 0 ? '58%' : '42%' }}
            />
            <div
              className="skeleton h-2 rounded opacity-40"
              style={{ width: index % 2 === 0 ? '34%' : '28%' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const StoryViewer = ({
  isOpen,
  user,
  stories,
  initialStoryIdx,
  onClose,
  onFinished,
  onPreviousUser,
  onStoryMarkedViewed,
  currentUserId,
}: Props) => {
  const [storyIdx, setStoryIdx] = useState(() => {
    if (initialStoryIdx !== undefined && initialStoryIdx !== null) return initialStoryIdx

    const firstUnseen = stories.findIndex((s) => !s.isViewed)
    return firstUnseen === -1 ? 0 : firstUnseen
  })
  const [progress, setProgress] = useState(0)
  const [viewers, setViewers] = useState<StoryViewerModel[]>([])
  const [viewerPage, setViewerPage] = useState(0)
  const [viewerTotal, setViewerTotal] = useState<number | null>(null)
  const [isViewerPanelOpen, setIsViewerPanelOpen] = useState(false)
  const [isFetchingViewers, setIsFetchingViewers] = useState(false)
  const [isAllViewersFetched, setIsAllViewersFetched] = useState(false)
  const [isFetchViewersFailed, setIsFetchViewersFailed] = useState(false)
  const progressRef = useRef(0)

  useEffect(() => {
    if (initialStoryIdx !== undefined && initialStoryIdx !== null) {
      setStoryIdx(initialStoryIdx)
      progressRef.current = 0
      setProgress(0)
      return
    }

    const firstUnseen = stories.findIndex((s) => !s.isViewed)
    setStoryIdx(firstUnseen === -1 ? 0 : firstUnseen)
    progressRef.current = 0
    setProgress(0)
  }, [initialStoryIdx, stories])

  const story = stories[storyIdx]
  const storyId = story?.id
  const isStoryOwner = !!story && story.user?.id === currentUserId
  const displayedViewCount = viewerTotal ?? story?.viewCount ?? 0
  const hasMoreViewers = !isAllViewersFetched && viewers.length < displayedViewCount

  const fetchStoryViewers = useCallback(async (page: number, replace = false) => {
    if (!storyId) return

    setIsFetchingViewers(true)
    setIsFetchViewersFailed(false)

    try {
      const response = await apiAgent.fetchOnClient(
        `/api/story/${storyId}/viewers?page=${page}&size=${VIEWER_PAGE_SIZE}`,
        { method: 'GET' },
      )

      if (!response.ok) throw new Error('Failed to fetch story viewers')

      const responseData = await response.json() as PaginatedResponse<StoryViewerModel>
      setViewers((prev) => (replace ? responseData.data : mergeByKey(prev, responseData.data, 'userId')));
      setViewerTotal(responseData.total)
      setViewerPage(page + 1)
      setIsAllViewersFetched(
        responseData.data.length === 0 ||
        page * VIEWER_PAGE_SIZE + responseData.data.length >= responseData.total,
      )
    } catch (error) {
      console.log(error)
      setIsFetchViewersFailed(true)
    } finally {
      setIsFetchingViewers(false)
    }
  }, [storyId])

  const markStoryViewed = useCallback(async (storyToView: Story) => {
    try {
      const response = await apiAgent.fetchOnClient(`/api/story/${storyToView.id}/view`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to mark story as viewed')

      onStoryMarkedViewed?.(storyToView.id)
    } catch (error) {
      console.log(error)
    }
  }, [onStoryMarkedViewed])

  useEffect(() => {
    if (!story || story.isViewed || story.user?.id === currentUserId) return
    markStoryViewed(story)
  }, [currentUserId, markStoryViewed, story])

  useEffect(() => {
    progressRef.current = 0
    setProgress(0)
    setViewers([])
    setViewerPage(0)
    setViewerTotal(story?.viewCount ?? null)
    setIsAllViewersFetched((story?.viewCount ?? 0) === 0)
    setIsViewerPanelOpen(false)
    setIsFetchViewersFailed(false)
  }, [storyId, story?.viewCount])

  const handleViewerLoaderVisible = useCallback(async () => {
    if (isFetchingViewers || isFetchViewersFailed || !hasMoreViewers) return
    await fetchStoryViewers(viewerPage)
  }, [fetchStoryViewers, hasMoreViewers, isFetchViewersFailed, isFetchingViewers, viewerPage])

  const goNext = useCallback(() => {
    if (!user) {
      onClose()
      return
    }

    if (storyIdx < stories.length - 1) {
      setStoryIdx((idx) => idx + 1)
      return
    }

    onFinished?.()
    if (!onFinished) onClose()
  }, [onClose, onFinished, stories.length, storyIdx, user])

  const goPrev = useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx((idx) => idx - 1)
      return
    }

    onPreviousUser?.()
  }, [onPreviousUser, storyIdx])

  useEffect(() => {
    if (!storyId || !isOpen || isViewerPanelOpen) return

    let currentProgress = progressRef.current

    const timer = setInterval(() => {
      currentProgress += 0.5
      progressRef.current = currentProgress

      if (currentProgress >= 100) {
        progressRef.current = 100
        setProgress(100)
        clearInterval(timer)
        goNext()
        return
      }

      setProgress(currentProgress)
    }, 25)

    return () => clearInterval(timer)
  }, [goNext, isOpen, isViewerPanelOpen, storyId])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      showCloseBtn={false}
    >
      {user && story && (
        <div className="relative" style={{ background: '#0a0a0a', borderRadius: 16 }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
            aria-label="Close"
          >
            <IconX size={16} color="white" />
          </button>

          <div className="flex flex-col h-[80vh] max-h-[800px] w-[80vh] max-w-[600px]">
            <div className="flex gap-1 p-3">
              {stories.map((s, i) => (
                <div
                  key={s.id}
                  className="h-0.5 flex-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.3)' }}
                >
                  <div
                    className="h-full rounded-full bg-white transition-none"
                    style={{
                      width:
                        i < storyIdx ? '100%' : i === storyIdx ? `${progress}%` : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-3 pb-2">
              <UserIcon
                userId={user.id}
                avatarUrl={user.avatar?.url}
                width={32}
                height={32}
                navigateToUserProfile={false}
              />
              <span className="text-sm font-medium text-white">{user.username}</span>
              <span className="text-xs text-white/60 ml-auto">
                {new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              className="flex-1 relative flex items-center justify-center rounded-b-2xl"
              style={{ background: '#111' }}
            >
              {story.media?.url ? (
                story.media.mimeType?.startsWith('video') ? (
                  <video
                    src={story.media.url}
                    autoPlay
                    muted
                    className="w-full h-full object-cover rounded-b-2xl"
                  />
                ) : (
                  <SmartImage
                    src={story.media.url}
                    alt="story"
                    objectFit="contain"
                    width="100%"
                    height="100%"
                    className="rounded-b-2xl"
                    withBlurredBackground
                  />
                )
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white/40 text-sm"
                  style={{ background: `${avatarColor(user.id)}33` }}
                >
                  Story {storyIdx + 1}
                </div>
              )}

              <button
                className="absolute left-0 top-0 h-full w-1/3"
                onClick={goPrev}
                aria-label="Previous story"
              />
              <button
                className="absolute right-0 top-0 h-full w-1/3"
                onClick={goNext}
                aria-label="Next story"
              />

              {isStoryOwner && (
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(10,10,10,0.72)', backdropFilter: 'blur(12px)' }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsViewerPanelOpen((isOpen) => !isOpen)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-white"
                    >
                      <IconEye size={18} />
                      <span className="text-sm font-medium">
                        {displayedViewCount} {displayedViewCount === 1 ? 'view' : 'views'}
                      </span>
                      <span className="ml-auto text-xs text-white/60">
                        {isViewerPanelOpen ? 'Hide' : 'Viewers'}
                      </span>
                    </button>

                    {isViewerPanelOpen && (
                      <div className="max-h-56 overflow-y-auto border-t border-white/10 px-3 py-2">
                        {viewers.map((viewer) => (
                          <div key={viewer.userId} className="flex items-center gap-2 py-1.5">
                            <UserIcon
                              userId={viewer.userId}
                              avatarUrl={viewer.avatar?.url}
                              width={28}
                              height={28}
                              navigateToUserProfile={false}
                            />
                            <span className="min-w-0 flex-1 truncate text-sm text-white">
                              {viewer.username}
                            </span>
                          </div>
                        ))}

                        {isFetchingViewers && viewers.length === 0 && (
                          <ViewerSkeletonRows />
                        )}

                        {!isFetchingViewers && isFetchViewersFailed && (
                          <button
                            type="button"
                            onClick={() => fetchStoryViewers(viewerPage, viewers.length === 0)}
                            className="w-full py-2 text-center text-xs font-medium text-white"
                          >
                            Retry loading viewers
                          </button>
                        )}

                        {!isFetchingViewers && !isFetchViewersFailed && viewers.length === 0 && (
                          <p className="py-2 text-center text-xs text-white/60">No viewers yet</p>
                        )}

                        {!isFetchViewersFailed && hasMoreViewers && (
                          <DataLoader
                            className="py-2"
                            onVisible={handleViewerLoaderVisible}
                          >
                            <ViewerSkeletonRows count={2} />
                          </DataLoader>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default StoryViewer
