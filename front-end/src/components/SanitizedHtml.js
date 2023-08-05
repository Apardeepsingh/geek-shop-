import React from 'react';
import DOMPurify from 'dompurify';

const SanitizedHtml = ({ htmlContent }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SanitizedHtml;
