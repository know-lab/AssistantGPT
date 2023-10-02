import Chat from './components/Chat'
import './styles/main.scss'

function App(): JSX.Element {
  return (
    <>
      <div className="header" />
      <main className="home">
        <div className="home__side"></div>
        <Chat />
      </main>
    </>
  )
}

export default App
