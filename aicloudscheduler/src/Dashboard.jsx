import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { fetchMetrics, detectAnomaly } from './anomalydetector'; 
import WebSocketComponent from './WebSocketComponent'; 

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState(false);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the server using `fetchMetrics`
        const metricsData = await fetchMetrics();
        setData(metricsData);
        setLoading(false);
        
        // Detect anomalies based on the fetched metrics
        const detectedAnomalies = detectAnomaly(metricsData);
        setAnomalies(detectedAnomalies);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Suspicious behavior detection logic
    let clickCount = 0;
    let keyPressCount = 0;
    const suspiciousThreshold = 5;

    const detectSuspiciousBehavior = () => {
      if (clickCount >= suspiciousThreshold || keyPressCount >= suspiciousThreshold) {
        setSuspiciousActivity(true);
        setPopupMessage('Suspicious activity detected! Monitoring...');
        setTimeout(() => {
          setPopupMessage(null);
        }, 3000);
      }
    };

    const handleUserClick = () => {
      clickCount++;
      detectSuspiciousBehavior();
    };

    const handleUserKeyPress = () => {
      keyPressCount++;
      detectSuspiciousBehavior();
    };

    window.addEventListener('click', handleUserClick);
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('click', handleUserClick);
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, []);

  useEffect(() => {
    if (suspiciousActivity) {
      console.log('Reporting suspicious activity to backend...');
      // Logic to report suspicious activity to the backend
      setTimeout(() => {
        setSuspiciousActivity(false);
        setPopupMessage('Suspicious activity resolved.');
      }, 5000);
    }
  }, [suspiciousActivity]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  return (
    <div className="container">
      {popupMessage && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}

      <header>
        <h1><b>AI-Based Cloud Infrastructure</b></h1>
      </header>

      <section className="dashboard">
        <div className="grid">
          <div className="item large">
            <h2><u>Dashboard - Cloud Infrastructure in real time</u></h2>
          </div>

          <div className="item small">
            <h2>Memory</h2>
            <div className="circle">
              <span>{data.memory}%</span>
            </div>
          </div>

          <div className="item small">
            <h2><u>CPU GSU</u></h2>
            <div className="card">
              <p><b>{data.cpu.gsu1}U</b></p>
              <p><b>{data.cpu.gsu2}U</b></p>
              <p><b>{data.cpu.gsu3}U</b></p>
            </div>
          </div>

          <div className="item small">
            <h2>Network</h2>
            <div className="circle">
              <span>{data.network}%</span>
            </div>
          </div>

          <div className="item small">
            <h2>Cost Overview</h2>
            <div className="circle">
              <span>{data.costOverview}%</span>
            </div>
          </div>

          <div className="item medium">
            <h2>Scaling Methods</h2>
            <div className="circle">
              <span>{data.scalingMethods}%</span>
            </div>
          </div>

          <div className="item small">
            <h2>Cost Suggestion</h2>
            <div className="circle">
              <span>{data.costSuggestion}%</span>
            </div>
          </div>

          <div className="item small">
            <h2>CPU vs Network</h2>
            <div className="bar-chart">
              <div className="bar" style={{ width: `${data.cpuVsNetwork}%` }}></div>
            </div>
          </div>

          <div className="item small">
            <h2>Reports</h2>
            <div className="card">
              <p><b>{data.reports.report1}%</b></p>
              <p><b>{data.reports.report2}%</b></p>
              <p><b>{data.reports.report3}%</b></p>
            </div>
          </div>

          <div className="item large">
            <h2>Anomalies Detected</h2>
            <ul>
              {anomalies.length > 0 ? (
                anomalies.map((anomaly, index) => (
                  <li key={index}>{anomaly}</li>
                ))
              ) : (
                <li>No anomalies detected</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <WebSocketComponent />
    </div>
  );
};

export default Dashboard;
