import { Mic } from '@renderer/icons/Mic'
import { useEffect, useState } from 'react'

interface VoiceInputProps {
  setUrl: (url: string) => void
}

export default function VoiceInput(props: VoiceInputProps): React.ReactElement {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(
    null as unknown as MediaRecorder
  )
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const initializeMediaRecorder = async (): Promise<void> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)

        recorder.ondataavailable = (event): void => {
          if (event.data.size > 0) {
            setAudioChunks((prevChunks) => [...prevChunks, event.data])
          }
        }

        recorder.onstop = (): void => {
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())

          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
          const audioUrl = URL.createObjectURL(audioBlob)
          props.setUrl(audioUrl)
          setIsRecording(false)
        }

        recorder.onstart = (): void => {
          setIsRecording(true)
          setAudioChunks([])
        }

        setMediaRecorder(recorder)
      } catch (error) {
        console.error('Error accessing microphone:', error)
      }
    }

    initializeMediaRecorder()
  }, [])

  const startRecording = (): void => {
    mediaRecorder.start()
  }

  const stopRecording = (): void => {
    const tracks = mediaRecorder.stream.getTracks()
    tracks.forEach((track) => track.stop())

    mediaRecorder.stop()
  }

  return (
    <>
      {isRecording ? (
        <button className="voice-input" onClick={stopRecording}>
          <Mic />
          Stop
        </button>
      ) : (
        <button className="voice-input" onClick={startRecording}>
          <Mic />
          Start
        </button>
      )}
    </>
  )
}
