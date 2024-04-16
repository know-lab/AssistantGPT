import { useEffect, useState } from 'react'
import { useUser, useActiveApiActionId, useActiveTab } from './ContextProvider'
import { ApiAction, ApiActionListItem } from '@renderer/types/types'

export default function ApiActionList(): React.ReactElement {
  const [user, setUser] = useUser()
  const [activeTab, setActiveTab] = useActiveTab()
  const [activeApiActionId, setActiveApiActionId] = useActiveApiActionId()

  const [apis, setApiActions] = useState<ApiActionListItem[]>([])

  const handleApiActionClick = (apiId: string): void => {
    setActiveApiActionId(apiId)
    setActiveTab('api-action')
  }

  const handleNewApiActionClick = (): void => {
    setActiveApiActionId(null)
    setActiveTab('create-api-action')
  }

  const handleDeleteApiActionClick = (apiId: string): void => {
    if (user === null) return
    const url = `http://localhost:8000/apiaction/${apiId}`
    fetch(url, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        if (res.error) {
          console.log(res.error)
          return
        }
        setApiActions(apis.filter((item) => item.id !== apiId))
        if (activeApiActionId === apiId) {
          setActiveApiActionId(null)
          setActiveTab('create-api-action')
        }
      })
  }

  useEffect(() => {
    if (user === null) {
      setApiActions([])
      return
    }
    const url = 'http://localhost:8000/apiaction/apilist'
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
          setApiActions([])
          console.log(res.error)
          return
        }
        setApiActions(res)
        console.log(response)
        return res
      })
  }, [activeApiActionId, user])

  return (
    <section className="api-list">
      {apis.map((item) => (
        <button
          onClick={(): void => handleApiActionClick(item.id)}
          className="workflow-list__item"
          key={item.id}
        >
          <h1 className="workflow-list__item__title">{item.title}</h1>
          {/* <p className="workflow-list__item__desc">{item.description}</p> */}
        </button>
      ))}
      <button
        onClick={handleNewApiActionClick}
        className="workflow-list__item workflow-list__item--add"
      >
        <h1 className="workflow-list__item__title">Create ApiAction</h1>
      </button>
    </section>
  )
}
