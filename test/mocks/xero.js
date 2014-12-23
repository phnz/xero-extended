var Xero = require('../../index.js');

var key = 'key',
    secret = 'secret',
    rsa = '-----BEGIN RSA PRIVATE KEY-----\nBLAH\n-----END RSA PRIVATE KEY-----';

  
var xero = new Xero(key, secret, rsa);

xero.XERO_API_URL = '';
xero.oa = {
  _performSecureRequest: function (a, b, method, url, e, xml, g, callback) {
    var request = method + ' ' + url,
        response = {};
    
    if (this.responses[request]) {
      response = this.responses[request];
    }
    
    callback(null, JSON.stringify(response));
  }
};


module.exports = xero;