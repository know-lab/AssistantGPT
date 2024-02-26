import {
  Workflow,
  TActiveWorkflowContext,
  TActiveTabContext,
  ActiveTab,
  User,
  TUserContext,
  TActiveChatIdContext
} from '@renderer/types/types'
import { createContext, useContext, useState } from 'react'

const ActiveTabContext = createContext<TActiveTabContext | null>(null)
const ActiveWorkflowContext = createContext<TActiveWorkflowContext | null>(null)
const ActiveChatIdContext = createContext<TActiveChatIdContext | null>(null)
const UserContext = createContext<TUserContext | null>(null)

export default function ContextProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const activeTabState = useState<ActiveTab>('chat')
  const activeWorkflowState = useState<Workflow | null>(null)
  const activeChatIdState = useState<string | null>(null)
  const userState = useState<User | null>(null)

  console.log(activeTabState)

  return (
    <ActiveTabContext.Provider value={activeTabState}>
      <ActiveWorkflowContext.Provider value={activeWorkflowState}>
        <ActiveChatIdContext.Provider value={activeChatIdState}>
          <UserContext.Provider value={userState}>{children}</UserContext.Provider>
        </ActiveChatIdContext.Provider>
      </ActiveWorkflowContext.Provider>
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

export const useActiveWorkflow = (): TActiveWorkflowContext => {
  const context = useContext(ActiveWorkflowContext)
  if (!context) {
    throw new Error('useActiveWorkflow must be used within a ContextProvider')
  }
  return context
}

export const useActiveChatId = (): TActiveChatIdContext => {
  const context = useContext(ActiveChatIdContext)
  if (!context) {
    throw new Error('useActiveWorkflow must be used within a ContextProvider')
  }
  return context
}

export const useUser = (): TUserContext => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useActiveWorkflow must be used within a ContextProvider')
  }
  return context
}

export const isAuthenticated = (): boolean => {
  const [user] = useUser()
  return user !== null
}
