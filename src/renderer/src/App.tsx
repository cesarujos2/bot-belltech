import { useCallback, useRef, useState } from "react"
import configIcon from './assets/config.svg'
import Loading from "./components/Loading/Loading"
import Interactions from "./components/Interactions/Interactions"

function App(): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const [logged, setLogged] = useState<{ success: boolean, error?: string }>({ success: true })
  const [state, setState] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<Array<string>>([])
  const isCancelled = useRef(false);

  const handleState = async () => {
    if(state){
      isCancelled.current = true
      setState(false)
    } else{
      isCancelled.current = false;
      setState(true);
      runRecursively();
    }
  }

  const runRecursively = useCallback(async () => {
    if (isCancelled.current) return;
    
    const response = await saveAudio();
    setLines(prev => [...prev, response]);
    
    if (isCancelled.current) return;
    
    runRecursively();
  }, []);


  const loginHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const formObject = Object.fromEntries(formData) as { username: string, password: string };

    if (formObject.username && formObject.password) {
      try {
        const response = await window.api.login(formObject.username, formObject.password);
        setLogged(response);
      } catch (error) {
        setLogged({ success: false, error: "Login failed. Try again." });
      } finally {
        setShowConfig(false);
        setLoading(false)
      }
    }
  }

  const saveAudio = async () => {
    try {
      const responseId = await window.api.getUniqueUnreviewedInteraction();
      if (responseId
        && responseId.success
        && responseId.data
        && responseId.data.length > 0
        && responseId.data[0].id) {
        const responseSave = await window.api.saveWAV(responseId.data[0].id);
        if (responseSave.success) {
          await window.api.updateInteractionStatus(responseId.data[0].id, 1, "Audio guardado");
          return responseId.data[0].id + " - " + "Success";
        } else {
          await window.api.updateInteractionStatus(responseId.data[0].id, -1, responseSave.error ?? "ERROR");
          return responseId.data[0].id + " - " + responseId.error;
        }
      } else {
        setState(false)
        isCancelled.current = true
        return "ERR0R - " + responseId.error;
      }
    } catch (error: any) {
      setState(false)
      isCancelled.current = true
      return error.message;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "40px 20px", width: "100%" }}>
      {loading && <Loading />}
      <div className="icon-config" onClick={() => { setShowConfig(prev => !prev) }}>
        <img src={configIcon} alt="icon-config" />
      </div>
      <div className="action" style={{ fontWeight: "800" }}>
        {!logged.success ? "NO LOGGED" : "LOGGED"}
      </div>
      {logged.error && (
        <div className="action" style={{ fontWeight: "600" }}>
          {logged.error}
        </div>
      )}
      {showConfig && (
        <div className="config">
          <form onSubmit={loginHandle}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input type="text" placeholder="Username" name="username" required />
              <input type="password" placeholder="Password" name="password" required />
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
      <Interactions lines={lines}></Interactions>
    </div>
  )
}

export default App
