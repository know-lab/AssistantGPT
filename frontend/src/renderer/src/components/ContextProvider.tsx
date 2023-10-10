import {
  Workflow,
  TActiveWorkflowContext,
  TActiveTabContext,
  ActiveTab
} from '@renderer/types/types'
import { createContext, useContext, useState } from 'react'

export const ActiveTabContext = createContext<TActiveTabContext | null>(null)
export const ActiveWorkflowContext = createContext<TActiveWorkflowContext | null>(null)

export default function ContextProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const activeTabState = useState<ActiveTab>('chat')
  const activeWorkflowState = useState<Workflow | null>(null)

  console.log(activeTabState)

  return (
    <ActiveTabContext.Provider value={activeTabState}>
      <ActiveWorkflowContext.Provider value={activeWorkflowState}>
        {children}
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
