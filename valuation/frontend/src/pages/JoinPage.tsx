import React from 'react'
import { ExternalLink } from 'lucide-react'

const JoinPage: React.FC = () => {
  const handleOpenForm = () => {
    window.open(
      'https://docs.google.com/forms/d/17xmxX50GNl2wpcL77krNnWvCT04rJnf9fkQo9oWj2QE/prefill',
      '_blank'
    )
  }

  return (
    <div className="container">
      <div className="card hero-section">
        <h2 className="card-title">انضمام المقيمين العقاريين إلى فالتيكس</h2>
        <p className="card-subtitle">
          للانضمام إلى شبكتنا من المقيمين المعتمدين والاستفادة من منصة التدقيق المتطورة،
          يرجى ملء نموذج الانضمام الرسمي.
        </p>

        <div className="benefits-list">
          <h3>مزايا الانضمام:</h3>
          <ul>
            <li>✓ الوصول إلى أدوات التدقيق المتقدمة</li>
            <li>✓ تحليل تقارير التقييم بالذكاء الاصطناعي</li>
            <li>✓ تصدير التقارير بصيغ مختلفة</li>
            <li>✓ لوحة تحكم شخصية لإدارة التقارير</li>
            <li>✓ دعم فني متخصص</li>
          </ul>
        </div>

        <button 
          onClick={handleOpenForm}
          className="btn-primary"
        >
          <ExternalLink size={20} />
          تعبئة نموذج الانضمام
        </button>

        <p className="disclaimer">
          سيتم مراجعة طلبكم من قبل فريقنا المختص والرد عليكم خلال 3-5 أيام عمل.
        </p>
      </div>
    </div>
  )
}

export default JoinPage


