import Chat from './components/Chat'
import WorkflowList from './components/WorkflowList'
import './styles/main.scss'
import { useActiveTab } from './components/ContextProvider'
import WorkflowDetails from './components/WorkflowDetails'

function App(): JSX.Element {
  const [activeTab, setActiveTab] = useActiveTab()
  return (
    <>
      <div className="header" />
      <main className="home">
        <div className="home__side">
          <WorkflowList />
        </div>
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'workflow' && <WorkflowDetails />}
      </main>
    </>
  )
}

export default App
