const config = require('../config');

module.exports = (err, req, res, next) => {
  if (config.nodeEnv === 'development') {
    console.error(err.stack);
  } else {
    console.error(`[${new Date().toISOString()}] ${err.message}`);
  }

  const status = err.status || 500;
  const message = err.status ? err.message : 'Internal server error';

  res.status(status).json({ success: false, message });
};
