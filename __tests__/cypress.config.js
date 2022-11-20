const { defineConfig } = require('cypress')
//npm run cypress:open
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000'
  }
})