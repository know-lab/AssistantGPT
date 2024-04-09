import { useEffect, useState } from 'react'
import VoiceInput from './VoiceInput'
import { useUser, useActiveChatId } from './ContextProvider'
import { IMessage } from '@renderer/types/types'

const initialMessages: IMessage[] = [
  { content: 'Hello, how can I help you?', role: 'assistant', type: 'message' } /* ,
  {
    content: 'I am on a mac, create a new folder on my Desktop named "Dog photos"',
    role: 'user',
    type: 'message'
  },
  {
    content: 'mkdir ~/Desktop/Dog\\ photos',
    role: 'assistant',
    type: 'command'
  },
  {
    content: "{'command': 'mkdir ~/Desktop/Dog\\ photos'}",
    role: 'assistant',
    type: 'confirmation-request'
  },
  {
    content: 'Yes',
    role: 'user',
    type: 'confirmation-answer'
  },
  {
    content: 'The command was successful. There was no output and no error.',
    role: 'assistant',
    type: 'result'
  } */
]

export default function Chat(): React.ReactElement {
  const [activeChatId, setActiveChatId] = useActiveChatId()
  const [user, setUser] = useUser()

  const [input, setInput] = useState<string>('')
  const [messages, setMessages] = useState<IMessage[]>(initialMessages)
  const [voiceMessageUrl, setVoiceMessageUrl] = useState<string>('')

  const [inputsEnabled, setInputsEnabled] = useState<boolean>(true)

  const sendRead = async (): Promise<void> => {
    if (!user) return
    if (!activeChatId) return
    const url = `http://localhost:8000/chat/${activeChatId}/read_message`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      }
    }).then((res) => res.json())
    // play speech.mp3 from backend/utils folder
    const audio = new Audio('/Users/kamka/AssistantGPT/backend/utils/speech.mp3')
    console.log(audio)
    audio.play()
  }

  const sendTextMessage = async (inputText: string, inputType: IMessage['type']): Promise<void> => {
    if (inputText.length === 0) return
    if (!user) return
    const url = activeChatId
      ? `http://localhost:8000/chat/${activeChatId}`
      : 'http://localhost:8000/chat'

    setMessages((messages) => [...messages, { content: inputText, role: 'user', type: inputType }])

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      },

      body: JSON.stringify({ content: inputText, type: inputType })
    }).then((res) => res.json())

    if (!response || !response[0] || !response[0].content) {
      console.log(response)
      setMessages((messages) => [
        ...messages,
        { content: JSON.stringify(response), role: 'assistant', type: inputType }
      ])
      return
    }

    setInput('')
    setMessages(response[0].content ?? [])
    setActiveChatId(response[0].id)
  }

  useEffect(() => {
    if (activeChatId === null) return
    if (user === null) return
    const url = `http://localhost:8000/chat/${activeChatId}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      }
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          console.log(response.error)
          setMessages((messages) => [
            ...messages,
            { content: response.error, role: 'assistant', type: 'message' }
          ])
          return
        }
        setMessages(response[0].content ?? [])
      })
  }, [activeChatId])

  useEffect(() => {
    if (voiceMessageUrl.length > 0) {
      //TODO: send message to backend
      //setMessages([...messages, { text: voiceMessageUrl, user: true }])
    }
  }, [voiceMessageUrl])

  return (
    <section className="chat">
      <div className="chat__messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            nextMessage={messages[index + 1]}
            sendTextMessage={sendTextMessage}
            setInputsEnabled={setInputsEnabled}
          />
        ))}
      </div>
      <div className="chat__input">
        <VoiceInput setUrl={setVoiceMessageUrl} />
        <div className="chat__input__text">
          <input
            className="chat__input__field"
            type="text"
            placeholder="Type a message"
            onChange={(e): void => setInput(e.target.value)}
            value={input}
          />
          <button className="chat__input__send" onClick={() => sendTextMessage(input, 'message')}>
            Send
          </button>
          <button className="chat__input__send" onClick={() => sendRead()}>
            Read
          </button>
        </div>
      </div>
    </section>
  )
}

function Message({
  message,
  nextMessage,
  sendTextMessage,
  setInputsEnabled
}: {
  message: IMessage
  nextMessage: IMessage | undefined
  sendTextMessage: (inputText: string, inputType: IMessage['type']) => void
  setInputsEnabled: (enabled: boolean) => void
}): React.ReactElement {
  if (nextMessage === undefined) {
    setInputsEnabled(false)
  }

  const answerButtonsEnabled = nextMessage === undefined
  const answerIsYes = nextMessage?.type === 'confirmation-answer' && nextMessage.content === 'Yes'
  const answerIsNo = nextMessage?.type === 'confirmation-answer' && nextMessage.content === 'No'

  if (message.role === 'user' && message.type === 'message')
    return (
      <div className="message--user">
        <p className="message--user__text">{message.content}</p>
      </div>
    )
  if (message.type === 'message' || message.type === undefined)
    return (
      <div className="message--system">
        <p className="message--system__text">{message.content}</p>
      </div>
    )
  if (message.type === 'confirmation-request')
    return (
      <div className="message--confirmation">
        <p className="message--confirmation__text">Would you like to run this command?</p>
        <div className="message--confirmation__buttons">
          <button
            className={
              'message--confirmation__button' +
              (answerIsYes
                ? ' message--confirmation__button--selected'
                : answerIsNo
                ? ' message--confirmation__button--not-selected'
                : '')
            }
            onClick={() => sendTextMessage('Yes', 'confirmation-answer')}
            disabled={!answerButtonsEnabled}
          >
            Yes
          </button>
          <button
            className={
              'message--confirmation__button' +
              (answerIsNo
                ? ' message--confirmation__button--selected'
                : answerIsYes
                ? ' message--confirmation__button--not-selected'
                : '')
            }
            onClick={() => sendTextMessage('No', 'confirmation-answer')}
            disabled={!answerButtonsEnabled}
          >
            No
          </button>
        </div>
      </div>
    )
  if (message.type === 'confirmation-answer') {
    return <></>
  }
  if (message.type === 'result')
    return (
      <div className="message--result">
        <p className="message--result__text">{message.content}</p>
      </div>
    )
  if (message.type === 'command')
    return (
      <div className="message--command">
        <p className="message--command__text">{message.content}</p>
      </div>
    )

  return <></>
}
