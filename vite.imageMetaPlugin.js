function remoteUrlFrom(reqUrl) {
  const remote = new URL(reqUrl, 'http://localhost').searchParams.get('url');
  if (!remote || !/^https?:\/\//i.test(remote)) return null;
  return remote;
}

async function handleImageMeta(req, res) {
  const remote = remoteUrlFrom(req.url);
  if (!remote) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ bytes: null }));
    return;
  }
  try {
    const head = await fetch(remote, { method: 'HEAD' });
    const bytes = Number(head.headers.get('content-length')) || null;
    const type = head.headers.get('content-type') || '';
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ bytes, type }));
  } catch {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ bytes: null }));
  }
}

async function handleImageFile(req, res) {
  const remote = remoteUrlFrom(req.url);
  if (!remote) {
    res.statusCode = 400;
    res.end();
    return;
  }
  try {
    const upstream = await fetch(remote);
    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.end();
      return;
    }
    const type = upstream.headers.get('content-type') || 'application/octet-stream';
    const buf = new Uint8Array(await upstream.arrayBuffer());
    res.statusCode = 200;
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'no-store');
    res.end(buf);
  } catch {
    res.statusCode = 502;
    res.end();
  }
}

function attachImageMetaRoutes(server) {
  server.middlewares.use(async (req, res, next) => {
    if (req.url?.startsWith('/__image-file')) {
      await handleImageFile(req, res);
      return;
    }
    if (req.url?.startsWith('/__image-meta')) {
      await handleImageMeta(req, res);
      return;
    }
    next();
  });
}

export function imageMetaPlugin() {
  return {
    name: 'image-meta',
    configureServer: attachImageMetaRoutes,
    configurePreviewServer: attachImageMetaRoutes,
  };
}
