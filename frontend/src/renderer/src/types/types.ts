export interface Workflow {
  id: string
  name: string
  description?: string
  params?: unknown
}

export type TActiveWorkflowContext =
  | [Workflow | null, React.Dispatch<React.SetStateAction<Workflow | null>>]
  | null

export type ActiveTab = 'chat' | 'workflow' | 'create-workflow' | null

export type TActiveTabContext = [ActiveTab, React.Dispatch<React.SetStateAction<ActiveTab>>] | null
