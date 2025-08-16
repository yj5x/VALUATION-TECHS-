import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    license_number: user?.license_number || '',
    membership_category: user?.membership_category || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(formData)
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="container">
      <div className="card">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <small>عضو منذ {new Date(user?.created_at || '').toLocaleDateString('ar-SA')}</small>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">تحديث الملف الشخصي</h3>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">الاسم الكامل</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="license_number">رقم الترخيص</label>
            <input
              type="text"
              id="license_number"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className="form-input"
              placeholder="رقم ترخيص التقييم (اختياري)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="membership_category">فئة العضوية</label>
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            <Save size={18} />
            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="section-title">إحصائيات الحساب</h3>
        <div className="account-stats">
          <div className="stat-item">
            <strong>البريد الإلكتروني:</strong>
            <span>{user?.email}</span>
          </div>
          <div className="stat-item">
            <strong>تاريخ الانضمام:</strong>
            <span>{new Date(user?.created_at || '').toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="stat-item">
            <strong>آخر تحديث:</strong>
            <span>{new Date(user?.updated_at || '').toLocaleDateString('ar-SA')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage



            <span>{new Date(user?.updated_at || ‘’).toLocaleDateString(‘ar-SA’)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage


