import React from 'react';
import { CheckCircle, XCircle, Lightbulb, FileText, MapPin, Calendar, DollarSign, Home, Ruler, User, Award } from 'lucide-react';

interface ReportResultsProps {
  report: any;
}

const ReportResults: React.FC<ReportResultsProps> = ({ report }) => {
  if (!report) {
    return <p>لا توجد نتائج لعرضها.</p>;
  }

  const { report_summary, compliance_score, missing_requirements, key_data_extracted, recommendations } = report;

  return (
    <div className="report-results">
      <div className="result-section summary-section">
        <h3>ملخص التقرير</h3>
        <p>{report_summary}</p>
      </div>

      <div className="result-section compliance-section">
        <h3>نسبة الامتثال</h3>
        <div className={`compliance-score ${compliance_score >= 80 ? 'high' : compliance_score >= 60 ? 'medium' : 'low'}`}>
          {compliance_score}%
        </div>
        <p>تشير هذه النسبة إلى مدى امتثال التقرير للمعايير واللوائح.</p>
      </div>

      {missing_requirements && missing_requirements.length > 0 && (
        <div className="result-section missing-requirements-section">
          <h3>المتطلبات المفقودة / غير المطابقة</h3>
          <ul>
            {missing_requirements.map((req: any, index: number) => (
              <li key={index}>
                <XCircle size={16} className="icon-red" />
                <strong>{req.requirement_name} ({req.category}):</strong> {req.details}
              </li>
            ))}
          </ul>
        </div>
      )}

      {key_data_extracted && ( Object.keys(key_data_extracted).length > 0) && (
        <div className="result-section key-data-section">
          <h3>البيانات الرئيسية المستخرجة</h3>
          <div className="data-grid">
            {key_data_extracted.property_address && (
              <div className="data-item">
                <MapPin size={18} />
                <strong>عنوان العقار:</strong> {key_data_extracted.property_address}
              </div>
            )}
            {key_data_extracted.valuation_date && (
              <div className="data-item">
                <Calendar size={18} />
                <strong>تاريخ التقييم:</strong> {new Date(key_data_extracted.valuation_date).toLocaleDateString('ar-SA')}
              </div>
            )}
            {key_data_extracted.valuation_method && (
              <div className="data-item">
                <FileText size={18} />
                <strong>طريقة التقييم:</strong> {key_data_extracted.valuation_method}
              </div>
            )}
            {key_data_extracted.market_value && (
              <div className="data-item">
                <DollarSign size={18} />
                <strong>القيمة السوقية:</strong> {key_data_extracted.market_value.toLocaleString('ar-SA')} ريال
              </div>
            )}
            {key_data_extracted.property_type && (
              <div className="data-item">
                <Home size={18} />
                <strong>نوع العقار:</strong> {key_data_extracted.property_type}
              </div>
            )}
            {key_data_extracted.area_sqm && (
              <div className="data-item">
                <Ruler size={18} />
                <strong>المساحة (م²):</strong> {key_data_extracted.area_sqm.toLocaleString('ar-SA')}
              </div>
            )}
            {key_data_extracted.owner_name && (
              <div className="data-item">
                <User size={18} />
                <strong>اسم المالك:</strong> {key_data_extracted.owner_name}
              </div>
            )}
            {key_data_extracted.appraiser_name && (
              <div className="data-item">
                <User size={18} />
                <strong>اسم المقيم:</strong> {key_data_extracted.appraiser_name}
              </div>
            )}
            {key_data_extracted.license_number && (
              <div className="data-item">
                <Award size={18} />
                <strong>رقم الترخيص:</strong> {key_data_extracted.license_number}
              </div>
            )}
          </div>
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="result-section recommendations-section">
          <h3>توصيات لتحسين التقرير</h3>
          <ul>
            {recommendations.map((rec: string, index: number) => (
              <li key={index}>
                <Lightbulb size={16} className="icon-blue" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportResults;


