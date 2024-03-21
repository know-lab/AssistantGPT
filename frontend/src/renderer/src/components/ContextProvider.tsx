import {
  Workflow,
  TActiveWorkflowIdContext,
  TActiveTabContext,
  ActiveTab,
  User,
  TUserContext,
  TActiveChatIdContext,
  TActiveApiActionIdContext
} from '@renderer/types/types'
import { createContext, useContext, useState } from 'react'

const ActiveTabContext = createContext<TActiveTabContext | null>(null)
const ActiveWorkflowIdContext = createContext<TActiveWorkflowIdContext | null>(null)
const ActiveApiActionIdContext = createContext<TActiveApiActionIdContext | null>(null)
const ActiveChatIdContext = createContext<TActiveChatIdContext | null>(null)
const UserContext = createContext<TUserContext | null>(null)

export default function ContextProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const activeTabState = useState<ActiveTab>('chat')
  const activeWorkflowIdState = useState<string | null>(null)
  const activeApiActionIdState = useState<string | null>(null)
  const activeChatIdState = useState<string | null>(null)
  const userState = useState<User | null>(null)

  console.log(activeTabState)

  return (
    <ActiveTabContext.Provider value={activeTabState}>
      <ActiveWorkflowIdContext.Provider value={activeWorkflowIdState}>
        <ActiveApiActionIdContext.Provider value={activeApiActionIdState}>
          <ActiveChatIdContext.Provider value={activeChatIdState}>
            <UserContext.Provider value={userState}>{children}</UserContext.Provider>
          </ActiveChatIdContext.Provider>
        </ActiveApiActionIdContext.Provider>
      </ActiveWorkflowIdContext.Provider>
    </ActiveTabContext.Provider>
  )
}

export const useActiveTab = (): TActiveTabContext => {
  const context = useContext(ActiveTabContext)
  if (!context) {
    throw new Error('useActiveTab must be used within a ContextProvider')
  }
  return context
}

export const useActiveWorkflowId = (): TActiveWorkflowIdContext => {
  const context = useContext(ActiveWorkflowIdContext)
  if (!context) {
    throw new Error('useActiveWorkflowId must be used within a ContextProvider')
  }
  return context
}

export const useActiveApiActionId = (): TActiveApiActionIdContext => {
  const context = useContext(ActiveApiActionIdContext)
  if (!context) {
    throw new Error('useActiveApiActionId must be used within a ContextProvider')
  }
  return context
}

export const useActiveChatId = (): TActiveChatIdContext => {
  const context = useContext(ActiveChatIdContext)
  if (!context) {
    throw new Error('useActiveChatId must be used within a ContextProvider')
  }
  return context
}

export const useUser = (): TUserContext => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a ContextProvider')
  }
  return context
}
