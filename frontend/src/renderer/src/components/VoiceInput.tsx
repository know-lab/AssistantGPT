import { Mic } from '@renderer/icons/Mic'
import { writeFile } from 'fs'
import { useEffect, useState } from 'react'
import { useUser, useActiveChatId } from './ContextProvider'

interface VoiceInputProps {
  setUrl: (url: string) => void
}

export default function VoiceInput(props: VoiceInputProps): React.ReactElement {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(
    null as unknown as MediaRecorder
  )
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [activeChatId, setActiveChatId] = useActiveChatId()
  const [user, setUser] = useUser()
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

        console.log('recorder', recorder)

        recorder.onstop = (): void => {
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())

          // // Convert the audio chunks to a Blob
          // const blob = new Blob(audioChunks, { type: 'audio/wav' })

          // // Convert the Blob to a Buffer
          // blob.arrayBuffer().then((arrayBuffer) => {
          //   const buffer = Buffer.from(arrayBuffer)

          //   // Save the Buffer to a file in current directory
          //   const filePath = 'audio.wav'
          //   if (filePath) {
          //     // Write the Buffer to a file
          //     writeFile(filePath, buffer, (err) => {
          //       if (err) {
          //         console.error('Error saving file:', err)
          //       } else {
          //         console.log('File saved:', filePath)
          //       }
          //     })
          //   }
          // })

          


          // console.log('Audio chunks:', audioChunks)
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

  const sendAudio = async (): Promise<void> => {
    const url = `http://localhost:8000/chat/0/interpret_audio`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      }
    }).then((res) => res.json())
 
  }
  return (
    <>
      {isRecording ? (
        <button className="voice-input" onClick={sendAudio}>
          <Mic />
          Stop
        </button>
      ) : (
        <button className="voice-input" onClick={sendAudio}>
          <Mic />
          Start
        </button>
      )}
    </>
  )
}
