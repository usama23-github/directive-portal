module.exports = {
  apps: [
    {
      name: "task_app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      watch: false,
    },
  ],
};
