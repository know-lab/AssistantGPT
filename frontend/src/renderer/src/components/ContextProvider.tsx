import {
  Workflow,
  TActiveWorkflowContext,
  TActiveTabContext,
  ActiveTab,
  User,
  TUserContext
} from '@renderer/types/types'
import { createContext, useContext, useState } from 'react'

const ActiveTabContext = createContext<TActiveTabContext | null>(null)
const ActiveWorkflowContext = createContext<TActiveWorkflowContext | null>(null)
const UserContext = createContext<TUserContext | null>(null)

export default function ContextProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const activeTabState = useState<ActiveTab>('chat')
  const activeWorkflowState = useState<Workflow | null>(null)
  const userState = useState<User | null>(null)

  console.log(activeTabState)

  return (
    <ActiveTabContext.Provider value={activeTabState}>
      <ActiveWorkflowContext.Provider value={activeWorkflowState}>
        <UserContext.Provider value={userState}>{children}</UserContext.Provider>
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

export const UseUser = (): TUserContext => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useActiveWorkflow must be used within a ContextProvider')
  }
  return context
}
