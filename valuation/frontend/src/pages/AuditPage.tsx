import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import FileUpload from '../components/FileUpload'
import LoadingSpinner from '../components/LoadingSpinner'
import ReportResults from '../components/ReportResults'
import * as api from '../services/api'
import toast from 'react-hot-toast'

const AuditPage: React.FC = () => {
  const { user } = useAuth()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [loadingMessage, setLoadingMessage] = useState('')

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files)
    setResults(null) // Clear previous results
  }

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      toast.error('يرجى اختيار ملفات PDF للتحليل')
      return
    }

    if (!user) {
      toast.error('يرجى تسجيل الدخول للمتابعة')
      return
    }

    try {
      setLoading(true)
      setLoadingMessage('جاري رفع الملفات...')

      // Upload files
      const uploadResponse = await api.uploadFiles(selectedFiles)
      const uploadedFileIds = uploadResponse.map((file: any) => file.id)
      toast.success('تم رفع الملفات بنجاح. جاري بدء التحليل...')

      // Start analysis
      setLoadingMessage('جاري تحليل الملفات بواسطة الذكاء الاصطناعي...')
      const analysisJob = await api.startAnalysis(uploadedFileIds)
      const jobId = analysisJob.jobId

      // Poll for analysis status
      let status = 'waiting'
      while (status !== 'completed' && status !== 'failed') {
        await new Promise(resolve => setTimeout(resolve, 3000)) // Wait for 3 seconds
        const statusResponse = await api.getAnalysisStatus(jobId)
        status = statusResponse.status
        setLoadingMessage(`حالة التحليل: ${status}...`)
      }

      if (status === 'completed') {
        const analysisResults = await api.getAnalysisResults(jobId)
        setResults(analysisResults)
        toast.success('اكتمل التحليل بنجاح!')
      } else {
        toast.error('فشل التحليل. يرجى المحاولة مرة أخرى.')
      }

    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء التحليل')
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }

  return (
    <div className="audit-page">
      <h2>تدقيق تقرير التقييم العقاري</h2>
      <p>قم بتحميل تقارير PDF لتقييمها بواسطة نظام الذكاء الاصطناعي الخاص بنا.</p>

      <div className="audit-section">
        <h3>1. تحميل الملفات</h3>
        <FileUpload onFilesSelected={handleFilesSelected} />
        <button 
          onClick={handleAnalyze} 
          className="btn btn-primary"
          disabled={loading || selectedFiles.length === 0}
        >
          {loading ? loadingMessage : 'بدء التحليل'}
        </button>
      </div>

      {loading && <LoadingSpinner text={loadingMessage} />}

      {results && (
        <div className="audit-section">
          <h3>2. نتائج التحليل</h3>
          <ReportResults report={results} />
        </div>
      )}
    </div>
  )
}

export default AuditPage


