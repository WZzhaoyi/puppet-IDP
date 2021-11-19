module.exports = {
  apps: [
    {
      name: "IDP",
      script: "main.js",
      watch: ["main.js", "libs"],
      ignore_watch: ["node_modules", "runs"],
    }
  ]
};