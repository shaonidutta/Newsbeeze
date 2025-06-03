import React from 'react'
import { Radio } from 'lucide-react'
import './Header.css'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Radio size={32} />
          <h1>NewsBreeze</h1>
        </div>
        <p className="tagline">Your Celebrity-Powered Audio News Reader</p>
      </div>
    </header>
  )
}

export default Header
