'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import StoryViewer from '@/components/StoryViewer/StoryViewer'
import { RootState } from '@/redux/store'
import { Story } from '@/lib/models/Story'
import { StoryUser } from '@/lib/models/user'

type OpenStoryViewerPayload = {
  user: StoryUser | null
  stories: Story[]
  initialStoryIdx?: number | null
  onFinished?: () => void
  onPreviousUser?: () => void
  onStoryMarkedViewed?: (storyId: number) => void
}

type StoryViewerState = OpenStoryViewerPayload & {
  isOpen: boolean
}

type StoryViewerContextType = {
  openStoryViewer: (payload: OpenStoryViewerPayload) => void
  closeStoryViewer: () => void
}

const StoryViewerContext = createContext<StoryViewerContextType | undefined>(undefined)

export const StoryViewerProvider = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useSelector((state: RootState) => state.currentUser)
  const [viewerState, setViewerState] = useState<StoryViewerState>({
    isOpen: false,
    user: null,
    stories: [],
    initialStoryIdx: null,
  })

  const closeStoryViewer = useCallback(() => {
    setViewerState((prev) => ({
      ...prev,
      isOpen: false,
      user: null,
      stories: [],
      initialStoryIdx: null,
    }))
  }, [])

  const openStoryViewer = useCallback((payload: OpenStoryViewerPayload) => {
    setViewerState({
      ...payload,
      initialStoryIdx: payload.initialStoryIdx ?? null,
      isOpen: true,
    })
  }, [])

  return (
    <StoryViewerContext.Provider value={{ openStoryViewer, closeStoryViewer }}>
      {children}
      <StoryViewer
        isOpen={viewerState.isOpen}
        user={viewerState.user}
        stories={viewerState.stories}
        initialStoryIdx={viewerState.initialStoryIdx}
        onClose={closeStoryViewer}
        onFinished={viewerState.onFinished}
        onPreviousUser={viewerState.onPreviousUser}
        onStoryMarkedViewed={viewerState.onStoryMarkedViewed}
        currentUserId={currentUser?.id}
      />
    </StoryViewerContext.Provider>
  )
}

export const useStoryViewer = () => {
  const context = useContext(StoryViewerContext)

  if (!context) {
    throw new Error('useStoryViewer must be used within a StoryViewerProvider')
  }

  return context
}
