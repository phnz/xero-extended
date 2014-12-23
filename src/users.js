module.exports = function (xero) {
  
  xero.Users = {
    all: function (callback) {
      xero.get('/Users', function (err, json) {
        if (err) {
          return callback(err);
        }
        
        callback(null, json.Users);
      });
    },
    
    
    find: function (id, callback) {
      xero.get('/Users/' + id, function (err, json) {
        if (err) {
          return callback(err);
        }
        
        callback(null, json.Users[0]);
      });
    },
  };
  
};