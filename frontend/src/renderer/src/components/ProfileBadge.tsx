import { UseUser, useActiveTab } from './ContextProvider'

export default function ProfileBadge(): React.ReactElement {
  const [activeTab, setActiveTab] = useActiveTab()
  const [user, setUser] = UseUser()

  const login = (): void => {
    setActiveTab('login')
  }

  const register = (): void => {
    setActiveTab('register')
  }

  const logout = async (): Promise<void> => {
    if (!user) return
    const response = await fetch('http://localhost:8000/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.jwt}`
      }
    })
    setUser(null)
  }

  return (
    <article className="profile-badge">
      {user && (
        <>
          <button onClick={logout} className="profile-badge__logout" />
          <div className="profile-badge__image"></div>
          <h1 className="profile-badge__name">{user.name}</h1>
        </>
      )}
      {!user && (
        <>
          <button onClick={login} className="profile-badge__login">
            Login
          </button>
          <button onClick={register} className="profile-badge__register">
            Register
          </button>
        </>
      )}
    </article>
  )
}
