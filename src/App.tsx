/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import Gallery from './components/gallery';
import PhotoGrid from './components/grid';
import { useImages } from './lib/useImages';

export default function App() {
  const { images, loading, error, needsConfig } = useImages();
  const displayImages = useMemo(() => images.slice(0, 8), [images]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50 uppercase tracking-widest text-sm animate-pulse">Loading Collection...</div>
      </main>
    );
  }

  if (needsConfig) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md border border-white/10 bg-white/5 p-8 rounded-2xl">
          <h2 className="text-2xl font-display italic text-white mb-4">Database Configuration Required</h2>
          <p className="text-white/60 mb-6 text-sm">
            Please configure your Turso database credentials in the Settings menu to view the gallery.
          </p>
          <div className="text-left bg-black/50 p-4 rounded-lg font-mono text-xs text-white/50 space-y-2">
            <div>TURSO_DATABASE_URL="..."</div>
            <div>TURSO_AUTH_TOKEN="..."</div>
          </div>
        </div>
      </main>
    );
  }

  if (error || images.length === 0) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
        <div className="text-white/50">
          <p className="mb-2">{error || 'No images found in the database.'}</p>
          <p className="text-sm">Please ensure your Turso database has data in the images table.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Gallery images={displayImages} />
      <PhotoGrid images={images} />
    </main>
  );
}
