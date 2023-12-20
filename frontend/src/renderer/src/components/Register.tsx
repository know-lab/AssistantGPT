import React, { useState } from 'react'
import { UseUser, useActiveTab } from './ContextProvider'

export default function Register(): React.ReactElement {
  const [activeTab, setActiveTab] = useActiveTab()
  const [user, setUser] = UseUser()

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordAgain, setPasswordAgain] = useState<string>('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setUser({ id: '1', name: username, jwt: '123' })
    //TODO: login to backend
  }

  return (
    <div className="login">
      <h1 className="login__title">Register</h1>
      <form onSubmit={onSubmit} className="login__form">
        <input
          className="login__form__input"
          value={username}
          onChange={(e): void => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
        />
        <input
          className="login__form__input"
          value={password}
          onChange={(e): void => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <input
          className="login__form__input"
          value={passwordAgain}
          onChange={(e): void => setPasswordAgain(e.target.value)}
          type="password"
          placeholder="Password again"
        />
        <button className="login__form__submit" type="submit" value="Login">
          Register
        </button>
      </form>
    </div>
  )
}
