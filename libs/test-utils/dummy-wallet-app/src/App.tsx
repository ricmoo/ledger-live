import React, { useMemo } from "react";
import { useE2EInjection } from "./hooks";
import "./App.css";

export default function App() {
  useE2EInjection();

  const params = useMemo(
    () => Array.from(new URLSearchParams(window.location.search).entries()),
    [],
  );

  return (
    <div className="App">
      <header className="App-header">
        <div id="image-container">
          <img src={"ledger-logo.png"} className="app-logo" alt="logo" width={180} height={180} />
          <img src={"dummy-icon.png"} className="dummy" alt="dummy" width={100} height={100} />
        </div>
        <h3>Ledger Live Dummy Wallet API App</h3>
        <p>App for testing the Ledger Live Wallet API manually and in Automated tests</p>
        <div id="param-container">
          Query Params for web app:
          <ol id="param-list">
            {params.map(([key, value]) => (
              <li key={key}>{`${key}: ${value}`}</li>
            ))}
          </ol>
        </div>
      </header>
    </div>
  );
}
