import { useEffect, useState } from 'react'
import { useActiveWorkflow } from './ContextProvider'
import Navigation from './Navigation'
import { Workflow } from '@renderer/types/types'

export default function WorkflowDetails(): React.ReactElement {
  const [activeWorkflow, setActiveWorkflow] = useActiveWorkflow()
  const [workflow, setWorkflow] = useState<Workflow | null>(activeWorkflow)
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
    if (activeWorkflow !== null) {
      setWorkflow(activeWorkflow)
    }
  }, [activeWorkflow])

  const handleSaveClick = (): void => {
    //TODO: save workflow
  }

  const handleCancelClick = (): void => {
    setWorkflow(activeWorkflow)
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
          value={workflow?.name}
          onChange={(e): void => onPropertyChange('name', e.target.value)}
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
          value={workflow?.script}
          onChange={(e): void => onPropertyChange('script', e.target.value)}
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
