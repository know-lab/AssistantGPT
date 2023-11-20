export interface Workflow {
  id: string
  name: string
  description: string
  script: string
  params?: unknown
}

export interface User {
  id: string
  name: string
}

export interface IMessage {
  text: string
  user: boolean
}

export interface Chat {
  id: string
  name?: string
  messages: IMessage[]
}

export type TActiveWorkflowContext = [Workflow | null, (workflow: Workflow | null) => void]

export type TActiveChatIdContext = [string | null, (chatId: string | null) => void]

export type ActiveTab = 'chat' | 'new-chat' | 'workflow' | 'create-workflow'

export type TActiveTabContext = [ActiveTab, (active: ActiveTab) => void]

export type TUserContext = [User | null, (user: User | null) => void]
