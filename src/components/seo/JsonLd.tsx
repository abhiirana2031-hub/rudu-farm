import React, { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
  id?: string;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data, id = 'rudu-schema-jsonld' }) => {
  useEffect(() => {
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      // Keep in head for crawler consistency
    };
  }, [data, id]);

  return null;
};
