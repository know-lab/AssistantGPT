import { useActiveTab } from './ContextProvider'

export default function WorkflowList(): React.ReactElement {
  const list = ['wf1', 'wf2', 'wf3']
  const [activeTab, setActiveTab] = useActiveTab()

  const handleWorkflowClick = (workflowId: string): void => {
    setActiveTab('workflow')
  }

  const handleNewWorkflowClick = (): void => {
    setActiveTab('chat')
  }

  return (
    <section className="workflow-list">
      {list.map((item) => (
        <button
          onClick={(): void => handleWorkflowClick(item)}
          className="workflow-list__item"
          key={item}
        >
          <h1 className="workflow-list__item__title">{item}</h1>
          <p className="workflow-list__item__desc">description</p>
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
