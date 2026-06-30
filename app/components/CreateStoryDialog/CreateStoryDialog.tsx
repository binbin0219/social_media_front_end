'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { IconPhotoPlus, IconTrash, IconUpload, IconX } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import Dialog from '@/components/Dialog'
import SmartImage from '@/components/SmartImage'
import LoadingButton from '@/components/LoadingButton/LoadingButton'
import { addToast } from '@/redux/slices/toastSlice'
import { apiAgent } from '@/lib/api-agent'
import { Story } from '@/lib/models/Story'
import { Media } from '@/lib/models/Media'

type Props = {
  isOpen: boolean
  onClose: () => void
  onStoryCreated: (story: Story) => void
}

type StoryResponse = Omit<Story, 'media'> & {
  media?: Media
}

function getMediaType(media: Media) {
  return media.mimeType;
}

function normalizeCreatedStory(story: StoryResponse, uploadedMedia: Media): Story {
  const media = story.media ?? uploadedMedia

  return {
    ...story,
    media: {
      id: media.id,
      url: media.url,
      mimeType: getMediaType(media),
    },
  }
}

const CreateStoryDialog = ({ isOpen, onClose, onStoryCreated }: Props) => {
  const dispatch = useDispatch()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleClose = () => {
    if (isCreating) return
    setFile(null)
    onClose()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image') && !selectedFile.type.startsWith('video')) {
      dispatch(addToast({ type: 'error', message: 'Please choose an image or video' }))
      return
    }

    setFile(selectedFile)
    e.target.value = ''
  }

  const handleCreateStory = async () => {
    if (!file || isCreating) return

    setIsCreating(true)

    try {
      const mediaFormData = new FormData()
      mediaFormData.set('file', file)

      const mediaResponse = await apiAgent.fetchOnClient('/api/media/', {
        method: 'POST',
        body: mediaFormData,
      })

      if (!mediaResponse.ok) throw new Error('Failed to upload story media')

      const uploadedMedia: Media = await mediaResponse.json()
      const storyResponse = await apiAgent.fetchOnClient(`/api/story/?mediaId=${uploadedMedia.id}`, {
        method: 'POST',
      })

      if (!storyResponse.ok) throw new Error('Failed to create story')

      const createdStory: StoryResponse = await storyResponse.json()
      onStoryCreated(normalizeCreatedStory(createdStory, uploadedMedia))
      dispatch(addToast({ type: 'success', message: 'Story created successfully' }))
      setFile(null)
      onClose()
    } catch (error) {
      console.error(error)
      dispatch(addToast({ type: 'error', message: 'Failed to create story' }))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} showCloseBtn={false}>
      <div className="w-[520px] max-w-full flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-textPrimary">Create story</h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-textPrimary hover:bg-bgHoverPrimary"
            aria-label="Close"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="relative h-[460px] overflow-hidden rounded-2xl border border-borderPrimary bg-bgSecondary">
          {previewUrl && file?.type.startsWith('image') && (
            <SmartImage
              src={previewUrl}
              alt="Story preview"
              objectFit="contain"
              width="100%"
              height="100%"
              position="absolute"
              withBlurredBackground
            />
          )}

          {previewUrl && file?.type.startsWith('video') && (
            <video
              src={previewUrl}
              controls
              className="h-full w-full object-contain"
            />
          )}

          {!previewUrl && (
            <label
              htmlFor="storyMedia"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 text-textSecondary hover:bg-bgHoverPrimary"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-appPrimary/10 text-appPrimary">
                <IconPhotoPlus size={28} />
              </div>
              <span className="text-sm font-semibold text-textPrimary">Choose media</span>
              <span className="text-xs text-textSecondary">Image or video</span>
            </label>
          )}
        </div>

        <input
          id="storyMedia"
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center justify-between gap-3">
          {file ? (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="secondary-app-btn flex items-center gap-2"
              disabled={isCreating}
            >
              <IconTrash size={16} />
              Remove
            </button>
          ) : (
            <label htmlFor="storyMedia" className="secondary-app-btn flex cursor-pointer items-center gap-2">
              <IconPhotoPlus size={16} />
              Select
            </label>
          )}

          <LoadingButton
            isLoading={isCreating}
            loaderColor="white"
            loaderWidth={18}
            onClick={handleCreateStory}
            disabled={!file || isCreating}
            className="primary-app-btn flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            text={(
              <>
                <IconUpload size={16} />
                Share story
              </>
            )}
            loadingText="Sharing..."
          />
        </div>
      </div>
    </Dialog>
  )
}

export default CreateStoryDialog
