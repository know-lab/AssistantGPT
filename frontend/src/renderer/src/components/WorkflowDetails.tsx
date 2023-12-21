import { useEffect, useState } from 'react'
import { UseUser, useActiveWorkflow as useActiveWorkflowId } from './ContextProvider'
import Navigation from './Navigation'
import { Workflow } from '@renderer/types/types'

export default function WorkflowDetails(): React.ReactElement {
  const [activeWorkflowId, setActiveWorkflowId] = useActiveWorkflowId()
  const [user, setUser] = UseUser()

  const [workflow, setWorkflow] = useState<Workflow | null>()
  const [originalWorkflow, setOriginalWorkflow] = useState<Workflow | null>()
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  const onPropertyChange = (property: string, value: string): void => {
    let newWorkflow
    if (workflow === null) {
      newWorkflow = {
        name: '',
        description: '',
        script: ''
      }
    } else {
      newWorkflow = { ...workflow }
    }
    newWorkflow[property] = value
    console.log(newWorkflow)
    setWorkflow(newWorkflow)
    if (newWorkflow.name !== '' && newWorkflow.description !== '' && newWorkflow.script !== '') {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
    if (!isEdited) {
      setIsEdited(true)
    }
  }

  useEffect(() => {
    if (activeWorkflowId === null) return
    if (user === null) return
    const url = `http://localhost:8000/workflow/${activeWorkflowId}`
    console
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      }
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          console.log(response.error)
          setWorkflow(response[0])
          setOriginalWorkflow(response[0])
          setActiveWorkflowId(response[0].id)
          return
        }
        setWorkflow(response[0])
        setOriginalWorkflow(response[0])
        setActiveWorkflowId(response[0].id)
      })
  }, [activeWorkflowId])

  const handleSaveClick = (): void => {
    if (workflow === null) return
    if (user === null) return
    console.log(activeWorkflowId)
    const url = activeWorkflowId
      ? `http://localhost:8000/workflow/${activeWorkflowId}`
      : 'http://localhost:8000/workflow'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      },
      body: JSON.stringify(workflow)
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          console.log(response.error)
          return
        }
        setWorkflow(response[0])
        setOriginalWorkflow(response[0])
        setActiveWorkflowId(response[0].id)
      })
  }

  const handleCancelClick = (): void => {
    setWorkflow(originalWorkflow)
    setIsEdited(false)
  }

  return (
    <section className="workflow-details">
      <section className="workflow-details__header">
        <Navigation prevTab="chat" />
        <h1 className="workflow-details__title">Workflow Details</h1>
      </section>
      <section className="workflow-details__content">
        <h2 className="workflow-details__content__subtitle">Title</h2>
        <input
          className="workflow-details__content__input"
          value={workflow?.title}
          onChange={(e): void => onPropertyChange('title', e.target.value)}
          type="text"
          placeholder="Workflow Name"
        />
        <h2 className="workflow-details__content__subtitle">Description</h2>
        <input
          className="workflow-details__content__input"
          value={workflow?.description}
          onChange={(e): void => onPropertyChange('description', e.target.value)}
          type="text"
          placeholder="Workflow Description"
        />
        <h2 className="workflow-details__content__subtitle">Script</h2>
        <textarea
          className="workflow-details__content__script"
          value={workflow?.definition}
          onChange={(e): void => onPropertyChange('definition', e.target.value)}
          placeholder="Workflow Script"
        />
      </section>
      <section className="workflow-details__footer">
        <button
          className="workflow-details__footer__button workflow-details__footer__button--save"
          disabled={!isEdited || !isFormValid}
          onClick={handleSaveClick}
        >
          Save
        </button>
        <button
          className="workflow-details__footer__button workflow-details__footer__button--cancel"
          disabled={!isEdited || !isFormValid}
          onClick={handleCancelClick}
        >
          Cancel
        </button>
      </section>
    </section>
  )
}
