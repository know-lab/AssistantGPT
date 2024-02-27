import React, { useState } from 'react'
import { useUser, useActiveTab } from './ContextProvider'

export default function Register(): React.ReactElement {
  const [activeTab, setActiveTab] = useActiveTab()
  const [user, setUser] = useUser()

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

  const isPasswordValid = (): boolean => {
    return password.length >= 6
  }

  const isEmailValid = (): boolean => {
    return email.includes('@') && email.includes('.') && email.length > 5
  }

  return (
    <div className="register">
      <h1 className="register__title">Register</h1>
      <form onSubmit={onSubmit} className="register__form">
        <input
          className="register__form__input"
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          type="text"
          placeholder="email"
        />
        {!isEmailValid() && <span className="register__form__error">Email is invalid!</span>}
        <input
          className="register__form__input"
          value={password}
          onChange={(e): void => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        {!isPasswordValid() && <span className="register__form__error">Password is invalid!</span>}
        <input
          className="register__form__input"
          value={passwordAgain}
          onChange={(e): void => setPasswordAgain(e.target.value)}
          type="password"
          placeholder="Password again"
        />
        {password !== passwordAgain && (
          <span className="register__form__error">Passwords do not match!</span>
        )}
        <button className="register__form__submit" type="submit" value="register">
          Register
        </button>
      </form>
    </div>
  )
}
