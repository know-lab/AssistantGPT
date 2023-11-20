import Chat from './components/Chat'
import WorkflowList from './components/WorkflowList'
import './styles/main.scss'
import { useActiveTab } from './components/ContextProvider'
import WorkflowDetails from './components/WorkflowDetails'
import ProfileBadge from './components/ProfileBadge'

function App(): JSX.Element {
  const [activeTab, setActiveTab] = useActiveTab()
  return (
    <>
      <div className="header" />
      <main className="home">
        <div className="home__side">
          <div className="home__side__profile">
            <ProfileBadge />
          </div>
          <div className="home__side__separator" />
          <div className="home__side__workflow-list ">
            <WorkflowList />
          </div>
        </div>
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'new-chat' && <Chat />}
        {activeTab === 'workflow' && <WorkflowDetails />}
        {activeTab === 'create-workflow' && <WorkflowDetails />}
      </main>
    </>
  )
}

export default App
