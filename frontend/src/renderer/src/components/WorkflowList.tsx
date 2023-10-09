//import { useState } from 'react'

import { useContext } from 'react'
import { ActiveTabContext } from './ContextProvider'

export default function WorkflowList(): React.ReactElement {
  const list = ['wf1', 'wf2', 'wf3']
  const asd = useContext(ActiveTabContext)

  console.log(asd)
  return (
    <section className="workflow-list">
      {list.map((item) => (
        <button className="workflow-list__item" key={item}>
          <h1 className="workflow-list__item__title">{item}</h1>
          <p className="workflow-list__item__desc">description</p>
        </button>
      ))}
      <button className="workflow-list__item workflow-list__item--add">
        <h1 className="workflow-list__item__title">+</h1>
      </button>
    </section>
  )
}
