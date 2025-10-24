import React from 'react'
import './App.scss'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Task Control Panel</h1>
          <p>Welcome to your task management system</p>
        </div>
      </header>
      
      <main className="app-main">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h2>Getting Started</h2>
            </div>
            <div className="card-body">
              <p>
                Your React + TypeScript + SCSS project is ready! 
                Start building your task management features step by step.
              </p>
              <div className="actions">
                <button className="btn btn-primary" onClick={() => alert('Hello from React!')}>
                  Test Button
                </button>
                <button className="btn btn-secondary ml-2" onClick={() => console.log('SCSS styles working!')}>
                  Check Console
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App