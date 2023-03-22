module.exports = function (app) {
  /*
  * Routes
  */
  app.use('/bill', require('./routes/bill.route'));
  app.use('/branch', require('./routes/branch.route'));
  app.use('/drugs', require('./routes/drugs.route'));
  app.use('/employee', require('./routes/employee.route'));
  app.use('/login', require('./routes/login.route'));
  app.use('/revenue', require('./routes/revenue.route'));
  app.use('/manager', require('./routes/manager.route'));
};
