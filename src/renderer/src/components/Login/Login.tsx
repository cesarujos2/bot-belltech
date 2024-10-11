import { useState } from "react";

type MyComponentProps = {
    children: React.ReactNode;
};

interface ILaunch {
    success: boolean;
    error?: string;
}

const Login: React.FC<MyComponentProps> = ({ children }) => {
    const [isLogged, setIsLogged] = useState<ILaunch>({ success: true });

    const LaunchHandle = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const objectData = Object.fromEntries(form) as { passwordLaunch: string };

        try {
            if (objectData.passwordLaunch) {
                const response = await window.api.auth(objectData.passwordLaunch);
                response ?
                    setIsLogged({ success: response }) :
                    setIsLogged({ success: response, error: "Contraseña Incorrecta!" });
            }
        } catch (error) {
            setIsLogged({ success: false, error: "Error en la conexión. Inténtalo de nuevo." });
        }
    };

    return (
        <div style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            {isLogged.success ? (
                <div style={{
                    height: "100%",
                    width: "100%",
                }}
                >{children}</div>
            ) : (
                <form onSubmit={LaunchHandle}>
                    <input
                        type="password"
                        placeholder="Password"
                        name="passwordLaunch"
                        required
                    />
                    <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
                        <button>Launch</button>
                    </div>
                    {isLogged.error && (
                        <div style={{ padding: "5px 0", display: "flex", justifyContent: "center" }}>
                            <p style={{ color: "#FFD42B" }}>{isLogged.error}</p>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default Login;
