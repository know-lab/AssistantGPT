import React, { useState } from 'react'
import { UseUser, useActiveTab } from './ContextProvider'

export default function Register(): React.ReactElement {
  const [activeTab, setActiveTab] = useActiveTab()
  const [user, setUser] = UseUser()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordAgain, setPasswordAgain] = useState<string>('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ email, password })
    }).then((res) => res.json())

    console.log(response)

    if (response.error) {
      console.log(response.error)
      return
    }

    setActiveTab('login')
  }

  return (
    <div className="login">
      <h1 className="login__title">Register</h1>
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
