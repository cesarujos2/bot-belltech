import { useState } from "react"
import configIcon from './assets/config.svg'

function App(): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const [logged, setLogged] = useState<{ success: boolean, error?: string }>({ success: false })
  const [state, setState] = useState<boolean>(false)

  const handleState = async () => {
    setState(prev => !prev)
  }

  const loginHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formObject = Object.fromEntries(formData) as { username: string, password: string };
    if (formObject.username && formObject.password && formObject.username.length > 0 && formObject.password.length > 0) {
      const response = await window.api.login(formObject.username, formObject.password)
      setLogged(response)
      setShowConfig(false)
    }
  }

  return (
    <div>
      <div className="icon-config" onClick={() => { setShowConfig(prev => !prev) }}>
        <img src={configIcon} alt="icon-config" />
      </div>
      <div className="action" style={{ fontWeight: "800" }}>
        {!logged.success ? "NO LOGGED" : "LOGGED"}
      </div>
      {showConfig && (
        <div className="config">
          <form onSubmit={loginHandle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input type="text" placeholder="Username" name="username" />
              <input type="password" placeholder="Password" name="password" />
            </div>
            <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
              <button>Login</button>
            </div>
          </form>
        </div>
      )}

      <div className="text">
        <span className="react">Decrypt</span>
        &nbsp;and <span className="ts">Download</span>
      </div>
      {logged.success && (
        <div className="action">
          <button onClick={handleState}>
            {!state ? "Start" : "Stop"}
          </button>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: `${state ? "green" : "red"}`, borderRadius: "50%" }}></div>
            {!state ? "Stopped" : "Running..."}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
