import {
  Workflow,
  TActiveWorkflowContext,
  TActiveTabContext,
  ActiveTab
} from '@renderer/types/types'
import { createContext, useState } from 'react'

export const ActiveWorkflowContext = createContext<TActiveWorkflowContext>(null)
export const ActiveTabContext = createContext<TActiveTabContext>(null)

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
