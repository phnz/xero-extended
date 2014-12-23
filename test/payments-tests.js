var should = require('should'),
    xero = require('./mocks/xero'),
    mockResponses = require('./mocks/payments');


describe('Payments', function () {
  beforeEach(function () {
    xero.oa.responses = mockResponses;
  });
  
  describe('#all', function () {
    it('should get a list of Payments', function () {
      xero.Payments.all(function (err, payments) {
        payments.should.be.an.instanceOf(Array);
        payments.length.should.be.above(0);
      });
    });
  });
  
  
  describe('#create', function () {
    it('should create a Payment', function () {
      var params = {
        Invoice: {
          InvoiceNumber: 'TEST'
        },
        Account: {
          Code: '001'
        },
        Date: new Date(),
        Amount: '99.95'
      };
      
      xero.Payments.create(params, function (err, payment) {
        payment.should.have.properties('PaymentID', 'Amount', 'Status');
        payment.Invoice.InvoiceNumber.should == 'TEST';
      });
    });
  });
  
  
  describe('#find', function () {
    it('should find a single Payment', function () {
      xero.Payments.find('22974891-3689-4694-9ee7-fd2ba917af55', function (err, payment) {
        payment.should.have.properties('PaymentID', 'Amount', 'Status', 'Account', 'Invoice');
        payment.PaymentID.should == '22974891-3689-4694-9ee7-fd2ba917af55';
      })
    })
  });

});
