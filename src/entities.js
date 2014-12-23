module.exports = function (xero) {
  
  require('./users')(xero);
  require('./invoices')(xero);
  require('./payments')(xero);
  
}