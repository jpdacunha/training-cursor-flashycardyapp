/**
 * StructuredData Component
 * 
 * Injects JSON-LD structured data into the page for SEO purposes.
 * Used to provide search engines with rich information about the content.
 * 
 * @see https://schema.org/
 */

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
