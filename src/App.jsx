import Dashboard from "./Dashboard.jsx"
import Header from "./header.jsx"
import "./App.css"

function App() {
  return (
    <div className="app">
      <Header activePage="Dashboard" />
      <main style={{padding: '20px'}}>
        <Dashboard />
      </main>
    </div>
  )
}

export default App