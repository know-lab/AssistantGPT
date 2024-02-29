import React, { useState } from 'react'
import { useUser, useActiveTab } from './ContextProvider'

export default function Login(): React.ReactElement {
  const [activeTab, setActiveTab] = useActiveTab()
  const [user, setUser] = useUser()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ email, password })
    }).then((res) => res.json())

    if (response.error) {
      console.log(response.error)
      return
    }

    setUser({ id: response.user.id, name: email, jwt: response.session.access_token })
    setActiveTab('chat')
  }

  return (
    <div className="login">
      <h1 className="login__title">Login</h1>
      <form onSubmit={onSubmit} className="login__form">
        <input
          className="login__form__input"
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          type="text"
          placeholder="email"
        />
        <input
          className="login__form__input"
          value={password}
          onChange={(e): void => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button className="login__form__submit" type="submit" value="Login">
          Login
        </button>
      </form>

      <button
        onClick={(): void => {
          setEmail('123@asd.hu')
          setPassword('asdasd')
        }}
      >
        Fill with default user
      </button>
    </div>
  )
}
