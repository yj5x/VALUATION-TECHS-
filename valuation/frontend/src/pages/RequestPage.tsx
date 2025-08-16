import React from "react";
import { ExternalLink } from "lucide-react";

const RequestPage: React.FC = () => {
  const handleOpenForm = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfx3sQi4_ISGhePJBggfEyyHW5kWOcYngDEyBi4tTRFhdLhzg/viewform?usp=header",
      "_blank"
    );
  };

  return (
    <div className="container">
      <div className="card hero-section">
        <h2 className="card-title">طلب تقييم عقاري جديد</h2>
        <p className="card-subtitle">
          لطلب تقييم عقاري معتمد أو تجديد تقييم سابق، يرجى ملء النموذج التالي
          وسيتواصل معكم أحد مقيمينا المعتمدين.
        </p>

        <div className="service-features">
          <h3>خدماتنا تشمل:</h3>
          <div className="features-grid">
            <div className="feature-item">
              <h4>تقييم العقارات السكنية</h4>
              <p>شقق، فلل، مجمعات سكنية</p>
            </div>
            <div className="feature-item">
              <h4>تقييم العقارات التجارية</h4>
              <p>مكاتب، محلات، مراكز تجارية</p>
            </div>
            <div className="feature-item">
              <h4>تقييم الأراضي</h4>
              <p>أراضي سكنية، تجارية، زراعية</p>
            </div>
            <div className="feature-item">
              <h4>تقييم العقارات الصناعية</h4>
              <p>مصانع، مستودعات، ورش</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleOpenForm}
          className="btn-primary"
        >
          <ExternalLink size={20} />
          تعبئة نموذج طلب التقييم
        </button>

        <div className="contact-info">
          <p>للاستفسارات والمساعدة، يمكنكم التواصل معنا:</p>
          <p>📞 الهاتف: 920000000</p>
          <p>📧 البريد الإلكتروني: info@valuationtechs.sa</p>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;


