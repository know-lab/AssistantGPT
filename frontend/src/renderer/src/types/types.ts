export interface Workflow {
  id: string
  title: string
  description: string
  definition: string
  params?: unknown
}

export interface ApiAction {
  id: string
  title: string
  description: string
  endpoint: string
  schema: string
  method: string
  header?: string
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
  type: 'message' | 'confirmation-request' | 'confirmation-answer' | 'result' | 'command'
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

export type TActiveWorkflowIdContext = [string | null, (workflowId: string | null) => void]

export type TActiveApiActionIdContext = [string | null, (apiActionId: string | null) => void]

export type TActiveChatIdContext = [string | null, (chatId: string | null) => void]

export type ActiveTab =
  | 'chat'
  | 'new-chat'
  | 'workflow'
  | 'create-workflow'
  | 'api-action'
  | 'create-api-action'
  | 'login'
  | 'register'

export type TActiveTabContext = [ActiveTab, (active: ActiveTab) => void]

export type TUserContext = [User | null, (user: User | null) => void]
