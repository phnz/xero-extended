var should = require('should'),
    xero = require('./mocks/xero'),
    mockResponses = require('./mocks/users');


describe('Users', function () {
  beforeEach(function () {
    xero.oa.responses = mockResponses;
  });
  
  describe('#all', function () {
    it('should get a list of Users', function () {
      xero.Users.all(function (err, users) {
        users.should.be.an.instanceOf(Array);
        users.length.should.be.above(0);
      });
    });
  });
  
  
  describe('#find', function () {
    it('should find a single User', function () {
      xero.Users.find('0ccf3aa2-3207-422f-82ef-2e3fc1ad5a81', function (err, user) {
        user.should.have.properties('UserID', 'FirstName', 'LastName');
      });
    });
  });
});