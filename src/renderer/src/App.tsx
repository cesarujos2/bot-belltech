import { useCallback, useEffect, useRef, useState } from "react"
import configIcon from './assets/config.svg'
import Loading from "./components/Loading/Loading"
import Interactions from "./components/Interactions/Interactions"
import Login from "./components/Login/Login"

function App(): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false)
  const [logged, setLogged] = useState<{ success: boolean, error?: string }>({ success: false })
  const [state, setState] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<Array<string>>([])
  const isCancelled = useRef(false);
  const [drives, setDrives] = useState<Array<string>>([])
  const [config, setConfig] = useState<{ username: string, password: string, drive: string, baseURL: string } | null>(null)
  const LIST_URL_AVAYA = ["172.30.147.17", "172.30.147.18"]

  const handleState = async () => {
    if (state) {
      isCancelled.current = true
      setState(false)
    } else {
      isCancelled.current = false;
      setState(true);
      runRecursively();
    }
  }

  const getDrive = async () => {
    const response = await window.api.getDrivesList()
    setDrives(response)
  }

  useEffect(() => {
    getDrive()
  }, [])

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
    const formObject = Object.fromEntries(formData) as { username: string, password: string, drive: string, baseURL: string };

    if (formObject.username && formObject.password && formObject.drive) {
      try {
        const urlSelected = "https://" + formObject.baseURL + "/webapp"
        const response = await window.api.login(formObject.username, formObject.password, urlSelected);
        if (response.success) {
          await window.api.setDrive(formObject.drive)
          setConfig(formObject);

        } else {
          setConfig(null);
        }
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
          return responseId.data[0].id + " - " + responseSave.error;
        }
      } else {
        setState(false)
        isCancelled.current = true
        return "NO HAY ID DISPONIBLE - " + responseId.error;
      }
    } catch (error: any) {
      setState(false)
      isCancelled.current = true
      return "ERROR INTERNO" + error.message;
    }
  };

  return (
    <Login>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "40px 20px",
          width: "100%",
          justifyContent: "center",
        }}>
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
        {config && (
          <>
            <div className="action" style={{ fontWeight: "600" }}>
             {`${config.baseURL}/DRIVE: ${config.drive}/${config.username} `}
            </div>
          </>

        )}
        {showConfig && (
          <div className="config">
            <form onSubmit={loginHandle}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" placeholder="Username" name="username" required />
                <input type="password" placeholder="Password" name="password" required />
                <select
                  name="baseURL"
                  id="baseURL"
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    fontSize: '16px',
                    transition: 'border 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #0070f3';
                    e.target.style.boxShadow = '0px 0px 0px 4px rgba(0, 112, 243, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #444';
                    e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.6)';
                  }}
                >
                  {LIST_URL_AVAYA.map((x) => (
                    <option key={x} value={x} style={{ color: '#fff', backgroundColor: '#333' }}>
                      {x}
                    </option>
                  ))}
                </select>
                <select
                  name="drive"
                  id="drive"
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    fontSize: '16px',
                    transition: 'border 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #0070f3';
                    e.target.style.boxShadow = '0px 0px 0px 4px rgba(0, 112, 243, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #444';
                    e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.6)';
                  }}
                >
                  {drives.map((x) => (
                    <option key={x} value={x} style={{ color: '#fff', backgroundColor: '#333' }}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
                <button>Login</button>
              </div>
            </form>
          </div>
        )}

        <div className="text" style={{ marginBottom: `${logged.success ? "" : "40px"}` }}>
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
        {logged.success && (<Interactions lines={lines}></Interactions>)}
      </div>
    </Login>
  )
}

export default App
