// PM2 process config for the Loadly Next.js standalone server on the Oracle VM.
// Single fork instance on purpose: src/middleware.ts keeps an in-memory
// rate-limit Map and Next's ISR cache is per-process — cluster mode would
// fragment both across workers instead of sharing one source of truth.
module.exports = {
  apps: [
    {
      name: 'loadly',
      script: 'server.js',
      cwd: '/opt/loadly/app/.next/standalone',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '3500M',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
};
