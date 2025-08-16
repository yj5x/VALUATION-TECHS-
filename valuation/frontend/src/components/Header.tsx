import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Building2, User, LogOut } from 'lucide-react'

const Header: React.FC = () => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="header">
      <div className="header-content">
        <nav className="nav-main">
          <Link 
            to="/audit" 
            className={`nav-link ${isActive('/audit') ? 'active' : ''}`}
          >
            تدقيق تقرير
          </Link>
          <Link 
            to="/join" 
            className={`nav-link ${isActive('/join') ? 'active' : ''}`}
          >
            الإنضمام إلى فالتيكس
          </Link>
          <Link 
            to="/request" 
            className={`nav-link ${isActive('/request') ? 'active' : ''}`}
          >
            طلب تقييم
          </Link>
        </nav>

        <div className="logo">
          <Building2 size={32} className="logo-icon" />
          <h1>VALUATION TECHS</h1>
        </div>

        <div className="nav-auth">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                لوحة التحكم
              </Link>
              <div className="user-menu">
                <Link to="/profile" className="user-info">
                  <User size={16} />
                  <span>{user.name}</span>
                </Link>
                <button onClick={logout} className="logout-btn">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                تسجيل الدخول
              </Link>
              <Link to="/register" className="nav-link btn-primary-small">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header


