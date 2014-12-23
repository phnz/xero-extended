var moment = require('moment');


module.exports = function (xero) {
  
  xero.Invoices = {
    
    // Type
    BILL: 'ACCPAY',
    SALE: 'ACCREC',
    
    // Status
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    AUTHORISED: 'AUTHORISED',
    PAID: 'PAID',
    DELETED: 'DELETED',
    VOIDED: 'VOIDED',
    
    // Line Amount Types
    EXCLUSIVE: 'Exclusive',
    INCLUSIVE: 'Inclusive',
    NO_TAX: 'NoTax',
    
    
    all: function (callback) {
      xero.get('/Invoices', function (err, json) {
        if (err) {
          return callback(err);
        }
        
        callback(null, json.Invoices);
      });
    },
    
    
    find: function (id, callback) {
      xero.get('/Invoices/' + id, function (err, json) {
        if (err) {
          return callback(err);
        }
        
        callback(null, json.Invoices[0]);
      });
    },
    
    
    create: function (params, callback) {
      if (params.Date) {
        params.Date = moment(params.Date).format('YYYY-MM-DD');
      }
      
      if (params.DueDate) {
        params.DueDate = moment(params.DueDate).format('YYYY-MM-DD');
      }
      
      xero.post('/Invoices', { Invoice: params }, function (err, json) {
        if (err) {
          return callback(err);
        }
        
        callback(null, json.Invoices[0]);
      });
    },
    
    
    update: function (id, params, callback) {
      xero.post('/Invoices/' + id, { Invoice: params }, function (err, json) {
        if (err) {
          return callback(err);
        }
        
        callback(null, json.Invoices[0]);
      })
    },
    
    
    delete: function (id, callback) {
      var params = {
        Status: xero.Invoices.DELETED
      };
      
      xero.post('/Invoices/' + id, { Invoice: params }, function (err, json) {
        if (err) {
          return callback(err);
        }
        
        callback(null, json.Invoices[0]);
      });
    }
  };
  
};