import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading latest news...</p>
    </div>
  )
}

export default LoadingSpinner
