const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;
const errorHandler = require('../index');
const jsonData = require('./example.json');

chai.use(dirtyChai);

describe('Errors Mapper', () => {
  let exampleData = {};

  beforeEach(() => {
    exampleData = Object.assign({}, jsonData);
  });

  it('should return error object if null or undefined', (done) => {
    let output = errorHandler(null);
    expect(output).to.be.null();

    output = errorHandler(undefined);
    expect(output).to.be.undefined();
    done();
  });

  it('should return error object as raw if isJoi flag is not found.', (done) => {
    delete exampleData.isJoi;
    const output = errorHandler(exampleData);
    expect(output.name).to.equal('ValidationError');
    expect(output.details[0].path).to.equal('form.handle');
    expect(output.details[0].type).to.equal('any.empty');
    expect(output.details[1].path).to.equal('form.handle');
    expect(output.details[1].type).to.equal('string.alphanum');
    done();
  });

  it('should return isJoi:true, valid:false, details:obj and object:obj properties', (done) => {
    const output = errorHandler(exampleData);
    expect(output.name).to.be.undefined();
    expect(output.isJoi).to.be.equal(true);
    expect(output.valid).to.be.equal(false);
    expect(output.details).to.not.be.null();
    expect(output._object).to.not.be.null();
    done();
  });

  it('should remove name property', (done) => {
    const output = errorHandler(exampleData);
    expect(output.name).to.be.undefined();
    done();
  });

  it('should return error object with unique single path if isJoi flag is found', (done) => {
    const output = errorHandler(exampleData);
    expect(output.details['form.handle'].type).to.equal('string.alphanum');
    expect(output.details['form.email'].type).to.equal('string.email');
    expect(output.details['form.password'].type).to.equal('string.min');
    done();
  });
});
