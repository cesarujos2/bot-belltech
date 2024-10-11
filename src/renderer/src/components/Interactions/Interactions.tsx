import { useEffect, useRef } from "react";
import './Interactions.css';

interface InteractionsProps {
  lines: Array<string>;
}

function Interactions({ lines }: InteractionsProps) {
  const terminalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      ref={terminalRef}
      className="terminal-scroll"
      style={{
        width: "100%",
        border: "2px solid #0F0F0F",
        flexGrow: 1,
        margin: "20px 0 0px 0",
        borderRadius: "10px",
        overflowY: "scroll",
        overflowX: "hidden",
        maxHeight: "400px", // Ajusta la altura según sea necesario
        userSelect: "text"
      }}
    >
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}

export default Interactions;
