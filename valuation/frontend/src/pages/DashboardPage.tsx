import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FileText, Download, Trash2, Eye, BarChart3 } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import * as api from '../services/api'
import toast from 'react-hot-toast'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [stats, setStats] = useState({
    totalReports: 0,
    averageCompliance: 0,
    totalFiles: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reportsResponse, filesResponse] = await Promise.all([
        api.getReports(),
        api.getFiles(),
      ])

      setReports(reportsResponse.reports)
      setFiles(filesResponse.files)

      // Calculate stats
      const totalReports = reportsResponse.reports.length
      const averageCompliance = totalReports > 0 
        ? reportsResponse.reports.reduce((sum: number, report: any) => sum + report.compliance_score, 0) / totalReports
        : 0

      setStats({
        totalReports,
        averageCompliance: Math.round(averageCompliance),
        totalFiles: filesResponse.files.length,
      })

    } catch (error: any) {
      toast.error('فشل في تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقرير؟')) return

    try {
      await api.deleteReport(reportId)
      setReports(reports.filter(r => r.id !== reportId))
      toast.success('تم حذف التقرير بنجاح')
    } catch (error: any) {
      toast.error('فشل في حذف التقرير')
    }
  }

  const handleExportReport = async (reportId: string) => {
    try {
      const blob = await api.exportReport(reportId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${reportId}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('تم تنزيل التقرير بنجاح')
    } catch (error: any) {
      toast.error('فشل في تنزيل التقرير')
    }
  }

  const handleExportSelected = async () => {
    if (selectedReports.length === 0) {
      toast.error('يرجى اختيار تقارير للتصدير')
      return
    }

    try {
      const blob = await api.exportMultipleReports(selectedReports)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `valuation-reports-${Date.now()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('تم تنزيل التقارير بنجاح')
    } catch (error: any) {
      toast.error('فشل في تنزيل التقارير')
    }
  }

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container">
      {/* Welcome Section */}
      <div className="card">
        <h2 className="card-title">مرحباً، {user?.name}</h2>
        <p className="card-subtitle">
          إدارة تقاريرك وملفاتك من مكان واحد
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalReports}</h3>
            <p>إجمالي التقارير</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.averageCompliance}%</h3>
            <p>متوسط نسبة الامتثال</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalFiles}</h3>
            <p>الملفات المرفوعة</p>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="card">
        <div className="section-header">
          <h3>تقاريرك</h3>
          <div className="section-actions">
            {selectedReports.length > 0 && (
              <button onClick={handleExportSelected} className="btn-secondary">
                تصدير المحدد ({selectedReports.length})
              </button>
            )}
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <p>لا توجد تقارير بعد</p>
            <a href="/audit" className="btn-primary">
              ابدأ التدقيق الآن
            </a>
          </div>
        ) : (
          <div className="reports-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedReports.length === reports.length}
                      onChange={(e) => 
                        setSelectedReports(e.target.checked ? reports.map(r => r.id) : [])
                      }
                    />
                  </th>
                  <th>اسم الملف</th>
                  <th>رقم التقرير</th>
                  <th>نسبة الامتثال</th>
                  <th>تاريخ التحليل</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => toggleReportSelection(report.id)}
                      />
                    </td>
                    <td>{report.file_name || `تقرير ${report.report_number}`}</td>
                    <td>{report.report_number}</td>
                    <td>
                      <span className={`compliance-badge ${
                        report.compliance_score >= 80 ? 'high' : 
                        report.compliance_score >= 60 ? 'medium' : 'low'
                      }`}>
                        {report.compliance_score}%
                      </span>
                    </td>
                    <td>{new Date(report.created_at).toLocaleDateString('ar-SA')}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleExportReport(report.id)}
                          className="action-btn"
                          title="تصدير"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="action-btn danger"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


export default DashboardPage


