import { Workflow, WorkflowListItem } from '@renderer/types/types'
import { useUser, useActiveTab, useActiveWorkflow as useActiveWorkflowId } from './ContextProvider'
import ChatList from './ChatList'
import { useEffect, useState } from 'react'

export default function WorkflowList(): React.ReactElement {
  const [user, setUser] = useUser()
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([])
  const [activeTab, setActiveTab] = useActiveTab()
  const [activeWorkflowId, setActiveWorkflowId] = useActiveWorkflowId()

  const handleWorkflowClick = (workflow_id): void => {
    setActiveWorkflowId(workflow_id)
    setActiveTab('workflow')
  }

  const handleNewWorkflowClick = (): void => {
    setActiveWorkflowId(null)
    setActiveTab('create-workflow')
  }

  useEffect(() => {
    if (user === null) {
      setWorkflows([])
      return
    }
    const url = 'http://localhost:8000/workflow/workflowlist'
    const response = fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.error) {
          setWorkflows([])
          console.log(res.error)
          return
        }
        setWorkflows(res)
        return res
      })
  }, [activeWorkflowId, user])

  return (
    <section className="workflow-list">
      {workflows.map((item) => (
        <button
          onClick={(): void => handleWorkflowClick(item.id)}
          className="workflow-list__item"
          key={item.id}
        >
          <h1 className="workflow-list__item__title">{item.title}</h1>
          {/* <p className="workflow-list__item__desc">{item.description}</p> */}
        </button>
      ))}
      <button
        onClick={handleNewWorkflowClick}
        className="workflow-list__item workflow-list__item--add"
      >
        <h1 className="workflow-list__item__title">Create Workflow</h1>
      </button>
      <ChatList />
    </section>
  )
}
