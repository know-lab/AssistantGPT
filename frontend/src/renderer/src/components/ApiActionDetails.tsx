import { useEffect, useState } from 'react'
import { useUser, useActiveApiActionId } from './ContextProvider'
import Navigation from './Navigation'
import { ApiAction } from '@renderer/types/types'

export default function ApiActionDetails(): React.ReactElement {
  const [activeApiId, setActiveApiActionId] = useActiveApiActionId()
  const [user, setUser] = useUser()

  const [api_def, setApiDef] = useState<ApiAction | null>()
  const [originalApiDef, setOriginalApiDef] = useState<ApiAction | null>()
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  const onPropertyChange = (property: string, value: string): void => {
    let newApi
    if (api_def === null) {
      newApi = {
        title: '',
        description: '',
        endpoint: '',
        method: '',
        header: '',
        schema_: ''
      }
    } else {
      newApi = { ...api_def }
    }
    newApi[property] = value
    console.log(newApi)
    setApiDef(newApi)
    if (newApi.name !== '' && newApi.description !== '' && newApi.script !== '') {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
    if (!isEdited) {
      setIsEdited(true)
    }
  }

  useEffect(() => {
    if (activeApiId === null) return
    if (user === null) return
    const url = `http://localhost:8000/apiaction/${activeApiId}`
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
          setApiDef(response[0])
          setOriginalApiDef(response[0])
          setActiveApiActionId(response[0].id)
          return
        }
        setApiDef(response[0])
        setOriginalApiDef(response[0])
        setActiveApiActionId(response[0].id)
      })
  }, [activeApiId])

  const handleSaveClick = (): void => {
    if (api_def === null) return
    if (user === null) return
    console.log(activeApiId)
    const url = activeApiId
      ? `http://localhost:8000/apiaction/${activeApiId}`
      : 'http://localhost:8000/apiaction'
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      },
      body: JSON.stringify(api_def)
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          console.log(response.error)
          return
        }
        setApiDef(response[0])
        setOriginalApiDef(response[0])
        setActiveApiActionId(response[0].id)
      })
  }

  const handleCancelClick = (): void => {
    setApiDef(originalApiDef)
    setIsEdited(false)
  }

  return (
    <section className="workflow-details">
      <section className="workflow-details__header">
        <Navigation prevTab="chat" />
        <h1 className="workflow-details__title">API Action Details</h1>
      </section>
      <section className="workflow-details__content">
        <h2 className="workflow-details__content__subtitle">Title</h2>
        <input
          className="workflow-details__content__input"
          value={api_def?.title}
          onChange={(e): void => onPropertyChange('title', e.target.value)}
          type="text"
          placeholder="API Action Name"
        />
        <h2 className="workflow-details__content__subtitle">Description</h2>
        <input
          className="workflow-details__content__input"
          value={api_def?.description}
          onChange={(e): void => onPropertyChange('description', e.target.value)}
          type="text"
          placeholder="API Action Description"
        />
        <h2 className="workflow-details__content__subtitle">Endpoint</h2>
        <input
          className="workflow-details__content__input"
          value={api_def?.endpoint}
          onChange={(e): void => onPropertyChange('endpoint', e.target.value)}
          type="text"
          placeholder="API Action Endpoint"
        />
        <h2 className="workflow-details__content__subtitle">Method</h2>
        <input
          className="workflow-details__content__input"
          value={api_def?.method}
          onChange={(e): void => onPropertyChange('method', e.target.value)}
          type="text"
          placeholder="GET / POST / PUT / DELETE..."
        />
        <h2 className="workflow-details__content__subtitle">Header</h2>
        <textarea
          className="workflow-details__content__script"
          value={api_def?.header}
          onChange={(e): void => onPropertyChange('header', e.target.value)}
          placeholder="API Action Header (Optional)"
        />
        <h2 className="workflow-details__content__subtitle">Schema</h2>
        <textarea
          className="workflow-details__content__script"
          value={api_def?.schema_}
          onChange={(e): void => onPropertyChange('definition', e.target.value)}
          placeholder="API Action Schema"
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
