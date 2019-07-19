require('should')
const robertFlemingNotice = require('./fixtures/RobertFleming_BnF_14797579.json')
const parseProperties = require('../lib/transform/parse_properties')
const parseItems = require('../lib/transform/parse_items')

describe('create pseudo properties from an interxmarc pep', function () {
  this.timeout(20000)

  describe('transform datafield', () => {
    it('should return an object of pseudo properties', done => {
      const propertyId = 'interxmarc:031:a:0'
      const properties = parseProperties(robertFlemingNotice)
      properties.should.be.an.Object()
      const propertiesList = Object.keys(properties)
      propertiesList.should.be.an.Array()
      propertiesList.includes(propertyId).should.be.true()
      properties[propertyId].pseudoId.should.equal(propertyId)
      properties[propertyId].labels.en.should.equal(propertyId)
      properties[propertyId].labels.fr.should.equal(propertyId)
      properties[propertyId].datatype.should.equal('string')
      done()
    })
  })
  describe('transform controlfield', () => {
    it('should return an object of pseudo properties', done => {
      const propertyId = 'interxmarc:001:0001'
      const properties = parseProperties(robertFlemingNotice)
      const propertiesList = Object.keys(properties)
      propertiesList.includes(propertyId).should.be.true()
      done()
    })
  })
  describe('transform leader', () => {
    it('should return an object of pseudo properties', done => {
      const propertyId = 'interxmarc:000:0004'
      const properties = parseProperties(robertFlemingNotice)
      const propertiesList = Object.keys(properties)
      propertiesList.includes(propertyId).should.be.true()
      done()
    })
  })
})

describe('create a pseudo item from an interxmarc pep', () => {
  describe('transform datafield', () => {
    it('should return a pseudo item id', done => {
      const itemPseudoId = '0  b.Fleming.Robert.1921-1976'
      const item = parseItems(robertFlemingNotice)
      item.should.be.an.Object()
      item.pseudoId.should.equal(itemPseudoId)
      item.labels.en.should.equal(itemPseudoId)
      item.labels.fr.should.equal(itemPseudoId)
      done()
    })
  })
  describe('transform datacontrol', () => {
    it('should return pseudo claims', done => {
      const itemPropertyPseudoId = 'interxmarc:001:0001'
      const item = parseItems(robertFlemingNotice)
      item.claims.should.be.an.Object()
      item.claims[itemPropertyPseudoId].should.be.an.Array()
      item.claims[itemPropertyPseudoId][0].should.equal('FR')
      done()
    })
  })
  describe('transform leader', () => {
    it('should return pseudo claims', done => {
      const itemPropertyPseudoId = 'interxmarc:000:0004'
      const item = parseItems(robertFlemingNotice)
      item.claims.should.be.an.Object()
      item.claims[itemPropertyPseudoId].should.be.an.Array()
      item.claims[itemPropertyPseudoId][0].should.equal('00615')
      done()
    })
  })
})