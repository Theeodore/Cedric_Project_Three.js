import React from 'react';
import Scene from './components/Scene';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700">
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-white text-2xl font-bold">3D Window Configurator</h1>
        <p className="text-slate-300 text-sm mt-1">Use the 3D controls to customize the window</p>
      </div>
      <Scene />
    </div>
  );
}

export default App;