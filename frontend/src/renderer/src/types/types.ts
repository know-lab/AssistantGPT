export interface Workflow {
  id: string
  title: string
  description: string
  definition: string
  params?: unknown
}

export interface WorkflowListItem {
  id: string
  title: string
}

export interface User {
  id: string
  name: string
  jwt: string
}

export interface IMessage {
  content: string
  role: 'user' | 'assistant' | 'system'
  type: 'message' | 'confirmation' | 'result' | 'command'
}

export interface Chat {
  id: string
  name?: string
  messages: IMessage[]
}

export interface ChatListItem {
  id: string
  title: string
}

export type TActiveWorkflowContext = [Workflow | null, (workflow: Workflow | null) => void]

export type TActiveChatIdContext = [string | null, (chatId: string | null) => void]

export type ActiveTab = 'chat' | 'new-chat' | 'workflow' | 'create-workflow' | 'login' | 'register'

export type TActiveTabContext = [ActiveTab, (active: ActiveTab) => void]

export type TUserContext = [User | null, (user: User | null) => void]
