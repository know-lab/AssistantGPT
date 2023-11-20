import { UseUser } from './ContextProvider'

export default function ProfileBadge(): React.ReactElement {
  const [user, setUser] = UseUser()

  const login = (): void => {
    setUser({ id: '1', name: 'Eros Pista' })
  }

  const logout = (): void => {
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
          <button className="profile-badge__register">Register</button>
        </>
      )}
    </article>
  )
}
