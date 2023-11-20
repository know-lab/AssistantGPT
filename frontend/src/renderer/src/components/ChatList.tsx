import { useEffect, useState } from 'react'
import { useActiveChatId, useActiveTab } from './ContextProvider'
import { Chat } from '@renderer/types/types'

export default function ChatList(): React.ReactElement {
  const [activeTab, setActiveTab] = useActiveTab()
  const [activeChatId, setActiveChatId] = useActiveChatId()

  const [chats, setChats] = useState<Chat[]>([])

  const handleChatClick = (chatId: string): void => {
    setActiveChatId(chatId)
    setActiveTab('chat')
  }

  const handleNewChatClick = (): void => {
    setActiveChatId(null)
    setActiveTab('new-chat')
  }

  useEffect(() => {
    //TODO: fetch messages from backend
    setChats([
      { id: '1', name: 'chat1', messages: [] },
      { id: '2', name: 'chat2', messages: [] }
    ])
  }, [activeChatId])

  return (
    <>
      {chats.map((item) => (
        <button
          onClick={(): void => handleChatClick(item.id)}
          className="workflow-list__item"
          key={item.id}
        >
          <h1 className="workflow-list__item__title">{item.name ?? item.id}</h1>
          {/* <p className="workflow-list__item__desc">{item.description}</p> */}
        </button>
      ))}
      <button onClick={handleNewChatClick} className="workflow-list__item workflow-list__item--add">
        <h1 className="workflow-list__item__title">Start new chat</h1>
      </button>
    </>
  )
}
