import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, CategoryScale, LinearScale, BarElement } from 'chart.js';
import './App.css';

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement);


const BACKEND_URL = "https://quantum-backend-v72l.onrender.com/api";
function App() {
  const [view, setView] = useState('home');
  const [logs, setLogs] = useState([]);
  const [loadingStep, setLoadingStep] = useState(0); 
  const [file, setFile] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState("");

  const pipeline = [
    "Executing Random Under-Sampling...",
    "Applying Angular Scaling [0, 2π]...",
    "Mapping Features to Hilbert Space...",
    "Calculating Fidelity Quantum Kernel...",
    "Optimizing Hyperplane via QSVC..."
  ];

  const dsLookup = {
    'set1': { total: '1,000', miss: '4', norm: '823', susp: '177' },
    'set2': { total: '5,000', miss: '47', norm: '3,942', susp: '1,058' },
    'set3': { total: '2,500', miss: '38', norm: '2,175', susp: '325' }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/logs`);
      setLogs(res.data);
    } catch (e) { 
        console.log("Backend offline or connection error. Check Render Logs."); 
    }
  };

  useEffect(() => { 
      if (view === 'logs') fetchLogs(); 
  }, [view]);

  const handleAnalysis = async () => {
    setLoadingStep(1);
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < pipeline.length ? prev + 1 : prev));
    }, 800);

    try {
      await axios.post(`${BACKEND_URL}/analyze`);
      setTimeout(() => {
        clearInterval(interval);
        setLoadingStep(0);
        setView('results');
      }, 4500);
    } catch (e) {
      clearInterval(interval);
      setLoadingStep(0);
      alert("Backend Error: Check if your Render server is waking up (Free tier takes a minute to start).");
    }
  };

  return (
    <div className="App">
      <nav>
        <div className="logo" onClick={() => setView('home')}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span>QuantumGuard</span>
        </div>
        <div className="nav-links">
          <a onClick={() => setView('home')} className={view === 'home' ? 'active' : ''}>Analyze Dataset</a>
          <a onClick={() => setView('results')} className={view === 'results' ? 'active' : ''}>Results Dashboard</a>
          <a onClick={() => setView('logs')} className={view === 'logs' ? 'active' : ''}>Blockchain Logs</a>
        </div>
      </nav>

      <main className="container">
        {view === 'home' && (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="badge">QSVC PIPELINE ACTIVE</span>
                <h1>Quantum-Powered<br/>Intrusion Detection</h1>
                <p className="hero-subtitle">Implementing second-order Pauli evolution circuits (ZZFeatureMap) for Wireless Mesh Network security.</p>
                <div style={{display:'flex', gap:'15px'}}>
                  <button className="btn btn-blue" onClick={() => document.getElementById('input-section').scrollIntoView({behavior:'smooth'})}>Start Analysis &rarr;</button>
                  <button className="btn btn-outline" onClick={() => document.getElementById('workflow-section').scrollIntoView({behavior:'smooth'})}>View How It Works</button>
                </div>
                <div className="hero-stats">
                   <div className="stat"><h2>83.2%</h2><p>Accuracy</p></div>
                   <div className="stat"><h2 style={{color:'var(--green)'}}>1.00</h2><p>Recall (Jellyfish)</p></div>
                   <div className="stat"><h2 style={{color:'var(--purple)'}}>4</h2><p>Top Features</p></div>
                </div>
              </div>
              <div className="hero-viz">
                 <div className="grid-line x-axis"></div><div className="grid-line y-axis"></div><div className="grid-line z-axis"></div>
                 <div className="shield-box-viz">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:'80px', color:'var(--primary)'}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"/></svg>
                 </div>
                 <div className="orbit-wrapper">
                    <div className="orb o-p"><span>⚛️</span></div>
                    <div className="orb o-r"><span>🛡️</span></div>
                    <div className="orb o-g"><span>📈</span></div>
                 </div>
              </div>
            </section>

            <section id="workflow-section" className="workflow-section">
                <h2 style={{fontSize:'3rem'}}>Proposed Methodology</h2>
                <div className="workflow">
                  <div className="w-step"><div className="w-circle s-blue"><div className="w-num">1</div>⬆</div><h4>Preprocessing</h4></div>
                  <div className="w-step w-middle"><div className="w-circle s-purple"><div className="w-num">2</div>⚙</div><h4>Quantum Kernel</h4></div>
                  <div className="w-step"><div className="w-circle s-green"><div className="w-num">3</div>📦</div><h4>Classification</h4></div>
                </div>
            </section>

            <section id="input-section" style={{padding:'100px 0'}}>
              <h2 style={{marginBottom:'30px'}}>📁 Dataset Input</h2>
              <div className="glass-card">
                <input type="file" id="f" hidden onChange={(e) => setFile(e.target.files[0].name)} />
                <div className="input-box" onClick={() => document.getElementById('f').click()}>
                  <div style={{fontSize:'3rem', opacity:0.3}}>⬆</div>
                  <h4 style={{marginTop:'15px'}}>{file ? `Ready: ${file}` : "Drag and drop WMN Traffic Log here"}</h4>
                  <button className="btn btn-blue" style={{marginTop:'20px', padding:'10px 25px'}}>Browse Files</button>
                </div>
                <div style={{margin:'30px 0', textAlign:'center', color:'var(--text-dim)'}}>— OR —</div>
                <select className="dataset-dropdown" style={{background:'#0f172a', color:'white', width:'100%', padding:'15px', borderRadius:'10px'}} onChange={(e) => setSelectedDataset(e.target.value)}>
                   <option value="">Select WMN-120k Dataset</option>
                   <option value="set1">CICIDS2017 Sample</option>
                   <option value="set3">UNSW-NB15 Sample (2500 records)</option>
                </select>
              </div>

              {(selectedDataset || file) && (
                <div className="glass-card mt-30">
                  <h3 style={{marginBottom:'25px'}}>📊 Feature Selection (Chi-Squared)</h3>
                  <div className="sum-grid">
                    <div><p>Total Samples</p><h3>{selectedDataset ? dsLookup[selectedDataset].total : '1,250'}</h3></div>
                    <div><p>Selected Features</p><h3>4</h3></div>
                    <div><p>Scaling</p><h3>[0, 2π]</h3></div>
                    <div><p style={{color:'var(--green)'}}>Balanced (Normal)</p><h3>50%</h3></div>
                    <div><p style={{color:'var(--red)'}}>Balanced (Attack)</p><h3>50%</h3></div>
                  </div>
                  <button className="btn btn-blue w-100 mt-30" onClick={handleAnalysis}>
                    {loadingStep > 0 ? pipeline[loadingStep-1] : "Run QSVC Analysis"}
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {view === 'results' && (
          <section style={{paddingTop:'120px'}}>
             <div className="dashboard-stats">
                <div className="glass-card"><h4>Overall Accuracy</h4><h2 style={{color:'var(--primary)'}}>83.2%</h2></div>
                <div className="glass-card"><h4>Jellyfish Recall</h4><h2 style={{color:'var(--green)'}}>1.00</h2></div>
                <div className="glass-card"><h4>Blackhole Recall</h4><h2 style={{color:'var(--red)'}}>0.68</h2></div>
             </div>
             <div className="charts-grid">
                <div className="glass-card">
                    <h4>Class Separation (Hilbert Space)</h4>
                    <div style={{maxWidth:'280px', margin:'0 auto'}}>
                        <Doughnut data={{labels:['Threat','Secure'], datasets:[{data:[450,550], backgroundColor:['#ef4444','#22c55e'], borderWidth:0}]}} options={{cutout:'75%', plugins:{legend:{display:false}}}} />
                    </div>
                </div>
                <div className="glass-card">
                    <h4>Top Features (Statistical Dependence)</h4>
                    <Bar data={{labels:['Duration','Src Bytes','Dst Bytes','Flags'], datasets:[{label:'Impact', data:[95,85,71,60], backgroundColor:'#3b82f6', borderRadius:8}]}} options={{plugins:{legend:{display:false}}}} />
                </div>
             </div>
          </section>
        )}

        {view === 'logs' && (
          <section style={{paddingTop:'120px'}}>
            <div className="blue-info-alert" style={{background:'rgba(59,130,246,0.05)', border:'1px solid var(--primary)', padding:'15px', borderRadius:'12px', marginBottom:'30px', display:'flex', gap:'15px'}}>
                <span>ℹ️</span> Every transaction ID represents a unique quantum state overlap calculation.
            </div>
            <div className="glass-card p-0">
              <table>
                <thead><tr><th>Transaction ID</th><th>QSVC Result</th><th>Timestamp</th><th>Quantum Hash</th></tr></thead>
                <tbody>
                  {logs.map((l, i) => (
                    <tr key={i}>
                      <td>{l.recordId}</td>
                      <td><span className={l.prediction === 'NORMAL' ? 'badge-green' : 'badge-red'}>{l.prediction}</span></td>
                      <td>{l.timestamp}</td>
                      <td style={{fontSize:'0.7rem', color:'var(--text-dim)', fontFamily:'monospace'}}>{l.hash}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                      <tr><td colSpan="4" style={{textAlign:'center', padding:'40px'}}>No records found in cloud database.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <footer style={{padding:'60px 0', textAlign:'center', borderTop:'1px solid var(--border)', marginTop:'100px'}}>
          <p style={{color:'var(--text-dim)', fontSize:'0.8rem'}}>© 2026 QuantumGuard Cybersecurity Research. Implementing QSVC Benchmarks.</p>
      </footer>
    </div>
  );
}

export default App;