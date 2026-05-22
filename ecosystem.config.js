module.exports = {
  apps: [
    {
      name: "propvault-backend",
      script: "dist/index.js",
      cwd: "C:\\Users\\Abdullah\\Desktop\\New folder (4)\\backend",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      error_file: "C:\\Users\\Abdullah\\Desktop\\New folder (4)\\logs\\backend-error.log",
      out_file:   "C:\\Users\\Abdullah\\Desktop\\New folder (4)\\logs\\backend-out.log",
    },
    {
      name: "propvault-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000",
      cwd: "C:\\Users\\Abdullah\\Desktop\\New folder (4)\\frontend",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_URL: "http://localhost:4000/api",
      },
      error_file: "C:\\Users\\Abdullah\\Desktop\\New folder (4)\\logs\\frontend-error.log",
      out_file:   "C:\\Users\\Abdullah\\Desktop\\New folder (4)\\logs\\frontend-out.log",
    },
  ],
};
