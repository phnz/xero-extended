var should = require('should'),
    xero = require('./mocks/xero'),
    mockResponses = require('./mocks/invoices');


describe('Invoices', function () {
  beforeEach(function () {
    xero.oa.responses = mockResponses;
  });
  
  describe('#all', function () {
    it('should get a list of Invoices', function () {
      xero.Invoices.all(function (err, invoices) {
        invoices.should.be.an.instanceOf(Array);
        invoices.length.should.be.above(0);
      });
    });
  });
  
  
  describe('#find', function () {
    it('should find a single Invoice', function () {
      xero.Invoices.find('0032f627-3156-4d30-9b1c-4d3b994dc921', function (err, invoice) {
        invoice.should.have.properties('InvoiceID', 'InvoiceNumber', 'Type', 'Contact', 'Payments');
        invoice.InvoiceID.should == '0032f627-3156-4d30-9b1c-4d3b994dc921';
        
        invoice.Contact.should.have.properties('ContactID', 'Name', 'Addresses');
        
        invoice.Payments.should.be.an.instanceOf(Array);
        invoice.Payments[0].should.have.properties('PaymentID', 'Amount', 'Reference');
      });
    });
  });
  
  
  describe('#create', function () {
    it('should create an Invoice', function () {
      var params = {
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
      
      xero.Invoices.create({ Reference: 'test' }, function (err, invoice) {
        invoice.should.have.properties('InvoiceID', 'InvoiceNumber', 'Type', 'Contact', 'Payments');
        
        invoice.Contact.should.have.properties('ContactID', 'Name', 'Addresses');
        invoice.Contact.Name.should.containEql('Nathan Hoad');
        
        invoice.LineItems.should.be.an.instanceOf(Array);
        invoice.LineItems[0].should.have.properties('Description', 'Quantity');
      });
    });
  });
  
  
  describe('#update', function () {
    it('should update a single Invoice', function () {
      xero.Invoices.update('0032f627-3156-4d30-9b1c-4d3b994dc921', { Reference: 'test' }, function (err, invoice) {
        invoice.should.have.properties('InvoiceID', 'InvoiceNumber', 'Type', 'Contact', 'Payments');
        invoice.InvoiceID.should == '0032f627-3156-4d30-9b1c-4d3b994dc921';
        
        invoice.Contact.should.have.properties('ContactID', 'Name', 'Addresses');
        
        invoice.Payments.should.be.an.instanceOf(Array);
        invoice.Payments[0].should.have.properties('PaymentID', 'Amount', 'Reference');
        
        invoice.Reference.should == 'Test';
      });
    });
  });
  
  
  describe('#delete', function () {
    it('should mark a single Invoice as deleted', function () {
      xero.Invoices.delete('0032f627-3156-4d30-9b1c-4d3b994dc922', function (err, invoice) {
        invoice.Status.should == xero.Invoices.DELETED;
      });
    });
  });
});
