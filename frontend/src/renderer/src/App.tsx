import { useContext } from 'react'
import Chat from './components/Chat'
import WorkflowList from './components/WorkflowList'
import './styles/main.scss'
import { ActiveTabContext } from './components/ContextProvider'

function App(): JSX.Element {
  const [activeTab, setActiveTab] = useContext(ActiveTabContext)
  return (
    <>
      <div className="header" />
      <main className="home">
        <div className="home__side">
          <WorkflowList />
        </div>
        {activeTab === 'chat' && <Chat />}
      </main>
    </>
  )
}

export default App
