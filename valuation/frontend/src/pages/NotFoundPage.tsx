import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <h1>404 - الصفحة غير موجودة</h1>
      <p>عذرًا، الصفحة التي تبحث عنها غير موجودة.</p>
      <Link to="/" className="btn btn-primary">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};

export default NotFoundPage;


