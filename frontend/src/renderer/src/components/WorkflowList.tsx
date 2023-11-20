import { Workflow } from '@renderer/types/types'
import { useActiveTab, useActiveWorkflow } from './ContextProvider'

export default function WorkflowList(): React.ReactElement {
  const workflows = [
    {
      id: '1',
      name: 'wf1',
      description: 'description of the first workflow asdasdasdasdasdasdasd asafa asd sad asd',
      script: 'script'
    },
    { id: '2', name: 'wf2', description: 'description of the second workflow', script: 'script' },
    { id: '3', name: 'wf3', description: 'description of the third workflow', script: 'script' },
    { id: '4', name: 'wf4', description: 'description of the fourth workflow', script: 'script' },
    { id: '5', name: 'wf5', description: 'description of the fifth workflow', script: 'script' },
    { id: '6', name: 'wf6', description: 'description of the sixth workflow', script: 'script' },
    { id: '7', name: 'wf7', description: 'description of the seventh workflow', script: 'script' },
    { id: '8', name: 'wf8', description: 'description of the eighth workflow', script: 'script' },
    { id: '9', name: 'wf9', description: 'description of the ninth workflow', script: 'script' },
    { id: '10', name: 'wf10', description: 'description of the tenth workflow', script: 'script' }
  ]
  const [activeTab, setActiveTab] = useActiveTab()
  const [activeWorkflow, setActiveWorkflow] = useActiveWorkflow()

  const handleWorkflowClick = (workflow: Workflow): void => {
    setActiveWorkflow(workflow)
    setActiveTab('workflow')
  }

  const handleNewWorkflowClick = (): void => {
    setActiveWorkflow(null)
    setActiveTab('create-workflow')
  }

  return (
    <section className="workflow-list">
      {workflows.map((item) => (
        <button
          onClick={(): void => handleWorkflowClick(item)}
          className="workflow-list__item"
          key={item.id}
        >
          <h1 className="workflow-list__item__title">{item.name}</h1>
          <p className="workflow-list__item__desc">{item.description}</p>
        </button>
      ))}
      <button
        onClick={handleNewWorkflowClick}
        className="workflow-list__item workflow-list__item--add"
      >
        <h1 className="workflow-list__item__title">+</h1>
      </button>
    </section>
  )
}
