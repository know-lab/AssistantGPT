import Chat from './components/Chat'
import WorkflowList from './components/WorkflowList'
import './styles/main.scss'
import { useActiveTab, useUser } from './components/ContextProvider'
import WorkflowDetails from './components/WorkflowDetails'
import ProfileBadge from './components/ProfileBadge'
import Login from './components/Login'
import Register from './components/Register'
import AssistantLogo from './assets/assistant-logo.png'
import ApiActionDetails from './components/ApiActionDetails'

function App(): JSX.Element {
  const [activeTab, setActiveTab] = useActiveTab()
  const [user, setUser] = useUser()
  return (
    <>
      <div className="header" />
      <main className="home">
        <div className="home__side">
          <div className="home__side__profile">
            <ProfileBadge />
          </div>
          {user !== null && (
            <>
              <div className="home__side__separator" />
              <div className="home__side__workflow-list ">
                <WorkflowList />
              </div>
            </>
          )}
        </div>
        {user === null && activeTab !== 'login' && activeTab !== 'register' && (
          <div className="home__page">
            <img className="home__page__logo" src={AssistantLogo} />
            <h1 className="home__page__title">Welcome to Assistant GPT</h1>
            <p className="home__page__description">
              Assistant GPT is a conversational AI that helps you with your tasks on your computer.
              It can understand your commands and execute them. It can also help you with your
              queries and provide you with the required information.
            </p>
          </div>
        )}
        {activeTab === 'login' && <Login />}
        {activeTab === 'register' && <Register />}
        {user !== null && activeTab === 'chat' && <Chat />}
        {user !== null && activeTab === 'new-chat' && <Chat />}
        {user !== null && activeTab === 'workflow' && <WorkflowDetails />}
        {user !== null && activeTab === 'create-workflow' && <WorkflowDetails />}
        {user !== null && activeTab === 'api-action' && <ApiActionDetails />}
        {user !== null && activeTab === 'create-api-action' && <ApiActionDetails />}
      </main>
    </>
  )
}

export default App
