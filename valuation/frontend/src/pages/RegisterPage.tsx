import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { User, Mail, Lock } from 'lucide-react'

const RegisterPage: React.FC = () => {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    license_number: '',
    membership_category: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(formData)
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">إنشاء حساب جديد</h2>
          <p className="auth-subtitle">انضم إلى مجتمع فالتيكس</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">الاسم الكامل</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="اسمك الكامل"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="example@domain.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">كلمة المرور</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="كلمة مرور قوية"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="license_number">رقم الترخيص (اختياري)</label>
                <input
                  type="text"
                  id="license_number"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="رقم ترخيص التقييم"
                />
              </div>

              <div className="form-group">
                <label htmlFor="membership_category">فئة العضوية (اختياري)</label>
                <select
                  id="membership_category"
                  name="membership_category"
                  value={formData.membership_category}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">اختر فئة العضوية</option>
                  <option value="مقيم معتمد">مقيم معتمد</option>
                  <option value="مقيم مشارك">مقيم مشارك</option>
                  <option value="مقيم تحت التدريب">مقيم تحت التدريب</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="auth-link">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage


