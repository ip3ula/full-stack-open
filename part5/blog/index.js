const app = require('./app.js')
const config = require('./Utils/config.js')
const logger = require('./Utils/logger')
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})