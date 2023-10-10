export interface Workflow {
  id: string
  name: string
  description?: string
  params?: unknown
}

export type TActiveWorkflowContext = [Workflow | null, (workflow: Workflow | null) => void]

export type ActiveTab = 'chat' | 'workflow' | 'create-workflow'

export type TActiveTabContext = [ActiveTab, (active: ActiveTab) => void]
