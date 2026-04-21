import { Hono } from 'hono';
import { serve, getRequestListener } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'node:http';
import { createClient } from '@libsql/client';
import path from 'path';
import { readFile } from 'fs/promises';

async function startServer() {
  const app = new Hono();
  const PORT = 3000;

  // Initialize Turso client
  let db: ReturnType<typeof createClient> | null = null;
  
  const getDb = () => {
    if (!db) {
      const url = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!url || !authToken) {
        throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required.');
      }
      
      db = createClient({
        url,
        authToken,
      });
    }
    return db;
  };

  // API routes
  app.get('/api/health', (c) => {
    return c.json({ status: 'ok' });
  });

  app.get('/api/images', async (c) => {
    try {
      const client = getDb();
      const result = await client.execute(`
        SELECT 
          i.id, 
          i.imageUrl as url, 
          p.title,
          p.groupName, 
          i.memberName as location,
          i.postedAt,
          p.articleUrl
        FROM images i
        LEFT JOIN posts p ON i.postId = p.id
        ORDER BY i.postedAt DESC
        LIMIT 50
      `);
      
      const images = result.rows.map(row => ({
        id: row.id,
        url: row.url,
        title: row.title || 'Untitled',
        groupName: row.groupName || 'Unknown Group',
        location: row.location || 'Unknown',
        postedAt: row.postedAt,
        articleUrl: row.articleUrl
      }));
      
      return c.json(images);
    } catch (error) {
      console.error('Database error:', error);
      return c.json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch images',
        needsConfig: error instanceof Error && error.message.includes('TURSO_')
      }, 500);
    }
  });

  // Simple memory cache for proxied images
  const imageCache = new Map<string, { buffer: ArrayBuffer; contentType: string }>();
  const MAX_CACHE_SIZE = 100;

  app.get('/api/proxy-image', async (c) => {
    const imageUrl = c.req.query('url');
    if (!imageUrl) {
      return c.text('Missing url parameter', 400);
    }

    const cached = imageCache.get(imageUrl);
    if (cached) {
      return c.body(cached.buffer, 200, {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=31536000',
        'X-Cache': 'HIT',
        'Access-Control-Allow-Origin': '*'
      });
    }

    try {
      let referer = '';
      try {
        referer = new URL(imageUrl).origin;
      } catch (e) {
        // Ignore
      }

      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          ...(referer ? { 'Referer': referer } : {})
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      
      // Store in cache with eviction limit
      if (imageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey) imageCache.delete(firstKey);
      }
      imageCache.set(imageUrl, { buffer: arrayBuffer, contentType });

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Cache-Control', 'public, max-age=31536000');
      headers.set('Access-Control-Allow-Origin', '*');

      return c.body(arrayBuffer, 200, Object.fromEntries(headers.entries()));
    } catch (error) {
      console.error('Image proxy error:', error);
      return c.text('Error proxying image', 500);
    }
  });

  // Server Integration
  if (process.env.NODE_ENV !== 'production') {
    // Development: Use native Node HTTP server to route to either Hono or Vite
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    const honoListener = getRequestListener(app.fetch);

    const devServer = createServer((req, res) => {
      // Direct /api requests to Hono
      if (req.url && req.url.startsWith('/api')) {
        honoListener(req, res);
      } else {
        // Direct all other requests to Vite
        vite.middlewares(req, res, () => {
          res.statusCode = 404;
          res.end('Not Found');
        });
      }
    });

    devServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Dev Server running on http://localhost:${PORT}`);
    });
  } else {
    // Production: Let Hono serve static files and the pre-built index.html
    const distPath = path.join(process.cwd(), 'dist');
    app.use('*', serveStatic({ root: './dist' }));
    app.get('*', async (c) => {
      try {
        const html = await readFile(path.join(distPath, 'index.html'), 'utf-8');
        return c.html(html);
      } catch (e) {
        return c.text('Not Found', 404);
      }
    });

    serve({
      fetch: app.fetch,
      port: PORT,
      hostname: '0.0.0.0'
    }, (info) => {
      console.log(`Prod Server running on http://${info.address}:${info.port}`);
    });
  }
}

startServer();

