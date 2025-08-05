import React from 'react';
import ColorPalette from './components/ColorPalette';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ padding: '20px 0', background: 'rgba(255, 255, 255, 0.1)' }}>
        <h1>Real-time Color Synchronization</h1>
        <p>Pick a color and watch it sync across all connected clients!</p>
      </header>
      <main style={{ padding: '20px', minHeight: '100vh' }}>
        <ColorPalette />
      </main>
    </div>
  );
}

export default App;
