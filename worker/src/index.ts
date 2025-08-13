// worker/src/index.ts

interface Env {
  SYNC_KV: KVNamespace;
  ALLOWED_ORIGIN: string;
}

interface SyncRequest {
  docId: string;
  encrypted: string;
}

interface SyncResponse {
  success: boolean;
  docId?: string;
  encrypted?: string;
  lastModified?: string;
  error?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Define allowed origins
    const allowedOrigins = [
      'https://calcium.eatonfamily.net',
      'http://localhost:5173',
      'https://calcium-dev.eatonfamily.net', 
      'http://eatonmediasvr.local:8080',
      'http://eatonmediasvr.local'
    ];
    
    const origin = request.headers.get('Origin');
    const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Ping endpoint for connection testing
      if (path === '/ping') {
        return Response.json(
          { success: true, message: 'Calcium sync worker is running' },
          { headers: corsHeaders }
        );
      }

      // Sync document endpoints
      const docMatch = path.match(/^\/sync\/([a-zA-Z0-9-]+)$/);
      if (!docMatch) {
        return Response.json(
          { success: false, error: 'Invalid endpoint' },
          { status: 404, headers: corsHeaders }
        );
      }

      const docId = docMatch[1];
      const kvKey = `doc:${docId}`;

      if (request.method === 'GET') {
        // Retrieve encrypted document
        const stored = await env.SYNC_KV.get(kvKey, { type: 'json' });
        
        if (!stored) {
          return Response.json(
            { success: false, error: 'Document not found' },
            { status: 404, headers: corsHeaders }
          );
        }

        const response: SyncResponse = {
          success: true,
          docId,
          encrypted: stored.encrypted,
          lastModified: stored.lastModified
        };

        return Response.json(response, { headers: corsHeaders });
      }

      if (request.method === 'PUT') {
        // Store encrypted document
        const body: SyncRequest = await request.json();
        
        if (!body.encrypted) {
          return Response.json(
            { success: false, error: 'Missing encrypted data' },
            { status: 400, headers: corsHeaders }
          );
        }

        const storeData = {
          encrypted: body.encrypted,
          lastModified: new Date().toISOString(),
          docId
        };

        await env.SYNC_KV.put(kvKey, JSON.stringify(storeData));

        const response: SyncResponse = {
          success: true,
          docId,
          lastModified: storeData.lastModified
        };

        return Response.json(response, { headers: corsHeaders });
      }

      if (request.method === 'HEAD') {
        // Check if document exists
        const exists = await env.SYNC_KV.get(kvKey);
        
        if (exists) {
          return new Response(null, { status: 200, headers: corsHeaders });
        } else {
          return new Response(null, { status: 404, headers: corsHeaders });
        }
      }

      return Response.json(
        { success: false, error: 'Method not allowed' },
        { status: 405, headers: corsHeaders }
      );

    } catch (error) {
      console.error('Worker error:', error);
      return Response.json(
        { success: false, error: 'Internal server error' },
        { status: 500, headers: corsHeaders }
      );
    }
  },
};