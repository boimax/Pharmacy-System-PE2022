const { createLogger, format, transports } = require("winston");

const log = createLogger({
  level: 'debug',
  format: format.cli(),
    transports: [new transports.Console()],
});


module.exports = log;

