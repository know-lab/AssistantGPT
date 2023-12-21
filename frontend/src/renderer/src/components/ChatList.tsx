import { useEffect, useState } from 'react'
import { UseUser, useActiveChatId, useActiveTab } from './ContextProvider'
import { Chat, ChatListItem } from '@renderer/types/types'

export default function ChatList(): React.ReactElement {
  const [user, setUser] = UseUser()
  const [activeTab, setActiveTab] = useActiveTab()
  const [activeChatId, setActiveChatId] = useActiveChatId()

  const [chats, setChats] = useState<ChatListItem[]>([])

  const handleChatClick = (chatId: string): void => {
    setActiveChatId(chatId)
    setActiveTab('chat')
  }

  const handleNewChatClick = (): void => {
    setActiveChatId(null)
    setActiveTab('new-chat')
  }

  useEffect(() => {
    if (user === null) return
    const url = 'http://localhost:8000/chat/chatlist'
    const response = fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.error) {
          setChats([])
          console.log(res.error)
          return
        }
        setChats(res)
        return res
      })
  }, [activeChatId, user])

  return (
    <>
      {chats.map((item) => (
        <button
          onClick={(): void => handleChatClick(item.id)}
          className="workflow-list__item"
          key={item.id}
        >
          <h1 className="workflow-list__item__title">{item.title ?? item.id}</h1>
          {/* <p className="workflow-list__item__desc">{item.description}</p> */}
        </button>
      ))}
      <button onClick={handleNewChatClick} className="workflow-list__item workflow-list__item--add">
        <h1 className="workflow-list__item__title">Start new chat</h1>
      </button>
    </>
  )
}
