import { useState, useEffect } from 'react';

export interface Image {
  id: number;
  url: string;
  title: string;
  groupName: string;
  location: string;
  postedAt: string;
  articleUrl?: string;
}

export function useImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsConfig, setNeedsConfig] = useState(false);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/images');
        const data = await response.json();
        
        if (!response.ok) {
          if (data.needsConfig) {
            setNeedsConfig(true);
          }
          throw new Error(data.error || 'Failed to fetch images');
        }
        
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  return { images, loading, error, needsConfig };
}
