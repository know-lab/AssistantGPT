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

export type TActiveWorkflowContext = [Workflow | null, (workflow: Workflow | null) => void]

export type ActiveTab = 'chat' | 'workflow' | 'create-workflow'

export type TActiveTabContext = [ActiveTab, (active: ActiveTab) => void]

export type TUserContext = [User | null, (user: User | null) => void]
