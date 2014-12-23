# Xero
 A simple node library for Xero Private Applications


## Install

    npm install xero-extended


## Use

You can use similar methods for `xero.Invoices`, `xero.Payments`, and `xero.Users`.

```javascript
var Xero = require('xero');
var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);

// Find a bunch of Invoices
xero.Invoices.all(function (err, invoices) {
  if (err) {
    return res.json(err);
  }
  
  res.json(null, invoices);
});

// Find a single Invoice
xero.Invoices.find('<Some ID>', function (err, invoice) {
  if (err) {
    return res.json(err);
  }
  
  res.json(null, invoice);
});

// Create an Invoice
var invoiceData = {
  Type: xero.Invoices.SALE,
  Contact: {
    Name: 'Nathan Hoad'
  },
  Date: new Date(),
  DueDate: '2014-12-01',
  LineAmountTypes: xero.Invoices.EXCLUSIVE,
  LineItems: [
    { 
       Description: 'This is a thing', 
       Quantity: 7, 
       UnitAmount: 120, 
       DiscountRate: 10,
       AccountCode: 200
     }
  ]
};
xero.Invoices.create(invoiceData, function (err, invoice) {
  if (err) {
    res.json(err);
  }
  
  res.json(null, invoice);
})
```


### Raw calls

#### Request

```javascript
var Xero = require('xero');

var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);
xero.call('GET', '/Users', null, function(err, json) {
    if (err) {
        log.error(err);
        return res.json(400, {error: 'Unable to contact Xero'});
    }
    return res.json(200, json);
});
```
    

#### Response

```javascript
{
   "Response":{
      "Id":"37286998-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "Status":"OK",
      "ProviderName":"My Account",
      "DateTimeUTC":"2013-04-22T17:13:31.2755569Z",
      "Users":[
         {
            "UserID":"613fbf01-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "FirstName":"Chadd",
            "LastName":"Sexington",
            "UpdatedDateUTC":"2013-04-12T05:54:50.477",
            "IsSubscriber":"true",
            "OrganisationRole":"STANDARD"
         }
      ]
   }
}
```

#### Download PDF

```javascript
var Xero = require('xero');
var fs = require('fs');

var xero = new Xero(CONSUMER_KEY, CONSUMER_SECRET, RSA_PRIVATE_KEY);
var invoiceId = 'invoice-identifier';
var req = xero.call('GET', '/Invoices/' + invoiceId);

req.setHeader('Accept', 'application/pdf');
req.on('response', function(response) {
  var file = fs.createWriteStream(invoiceId + '.pdf');
  response.pipe(file);
});
req.end();
```

## Docs
http://developer.xero.com/api/

## Authors

* thallium205 <https://github.com/thallium205>
* nathanhoad <https://github.com/nathanhoad>