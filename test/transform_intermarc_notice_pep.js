require('should')
const sampleBNFpep = require('./fixtures/sample_BNF_pep.json')
const sampleBNFpepSansPrenom = require('./fixtures/sample_BNF_pep_sans_prénom.json')
const sampleBnfPepAvecDateIncertaine = require('./fixtures/sample_BNF_pep_avec_date_incertaine.json')
const sampleBnfPepAvecDateApproximative = require('./fixtures/sample_BNF_pep_avec_date_approximative.json')
const parseProperties = require('../lib/transform/parse_properties')
const parseNotice = require('../lib/transform/parse_notice')

describe('create pseudo properties from an intermarc pep', function () {
  this.timeout(20000)

  describe('transform controlfield', () => {
    it('should return an object of pseudo properties', done => {
      const propertyId = 'intermarc_001'
      const properties = parseProperties(sampleBNFpep)
      const propertiesList = Object.keys(properties)
      propertiesList.includes(propertyId).should.be.true()
      done()
    })
  })
  describe('transform leader', () => {
    it('should return an object of pseudo properties', done => {
      const propertyId = 'intermarc_leader'
      const properties = parseProperties(sampleBNFpep)
      const propertiesList = Object.keys(properties)
      propertiesList.includes(propertyId).should.be.true()
      done()
    })
  })
})

describe('create a pseudo item from an intermarc pep', () => {
  describe('transform datafield', () => {
    it('should return a pseudo item id', done => {
      const itemPseudoId = '0  b.Fleming.Robert.1921-1976'
      const { items } = parseNotice(sampleBNFpep)
      const item = items[0]
      item.should.be.an.Object()
      item.pseudoId.should.equal(itemPseudoId)
      item.labels.en.should.equal(itemPseudoId)
      item.labels.fr.should.equal(itemPseudoId)
      done()
    })
  })
  describe('transform datacontrol', () => {
    it('should return pseudo claims', done => {
      const itemPropertyPseudoId = 'intermarc_001'
      const { items } = parseNotice(sampleBNFpep)
      const item = items[0]
      item.claims.should.be.an.Object()
      item.claims[itemPropertyPseudoId].should.be.an.Array()
      item.claims[itemPropertyPseudoId][0].should.equal('FRBNF14797579X')
      done()
    })
  })

  describe('pivot property claims', () => {
    it('should return "Nom" claims', done => {
      const item = parseNotice(sampleBNFpep).items[0]
      item.claims['Nom'].should.be.an.Array()
      const claim = item.claims['Nom'][0]
      claim.value.should.equal('Fleming')
      claim.references[0].should.deepEqual({
        'identifiant de la zone': [ 'intermarc_100' ],
        'données source de la zone': [ '$w 0  b $a Fleming $m Robert $d 1921-1976' ]
      })
      done()
    })

    it('should return "Prénom" claims', done => {
      const item = parseNotice(sampleBNFpep).items[0]
      item.claims['Prénom'].should.be.an.Array()
      const claim = item.claims['Prénom'][0]
      claim.value.should.equal('Robert')
      claim.references[0].should.deepEqual({
        'identifiant de la zone': [ 'intermarc_100' ],
        'données source de la zone': [ '$w 0  b $a Fleming $m Robert $d 1921-1976' ]
      })
      done()
    })

    it('should return "Date de naissance" claims', done => {
      const item = parseNotice(sampleBNFpep).items[0]
      item.claims['Date de naissance'].should.be.an.Array()
      const claim = item.claims['Date de naissance'][0]
      claim.value.should.equal('1921-11-12')
      claim.references[0].should.deepEqual({
        'identifiant de la zone': [ 'intermarc_008' ],
        'données source de la zone': [ '970528101018ca   m          19211112  19761128             a 1' ]
      })
      done()
    })

    it('should return "Date de décès" claims', done => {
      const item = parseNotice(sampleBNFpep).items[0]
      item.claims['Date de décès'].should.be.an.Array()
      const claim = item.claims['Date de décès'][0]
      claim.value.should.equal('1976-11-28')
      claim.references[0].should.deepEqual({
        'identifiant de la zone': [ 'intermarc_008' ],
        'données source de la zone': [ '970528101018ca   m          19211112  19761128             a 1' ]
      })
      done()
    })

    it('should return "Activité" claims', done => {
      const item = parseNotice(sampleBNFpep).items[0]
      item.claims['Activité'].should.be.an.Array()
      const claim = item.claims['Activité'][0]
      claim.value.should.equal('a')
      claim.references[0].should.deepEqual({
        'identifiant de la zone': [ 'intermarc_045' ],
        'données source de la zone': [ '$a a' ]
      })
      done()
    })

    it('should not return non-pep type specific claims', done => {
      const item = parseNotice(sampleBNFpep).items[0]
      should(item.claims["Titre de l'oeuvre"]).not.be.ok()
      should(item.claims["Langue de l'oeuvre"]).not.be.ok()
      done()
    })

    it('should ignore a missing field or subfield', done => {
      const item = parseNotice(sampleBNFpepSansPrenom).items[0]
      should(item.claims['Prénom']).not.be.ok()
      done()
    })

    it('should parse incertain dates', done => {
      const item = parseNotice(sampleBnfPepAvecDateIncertaine).items[0]
      item.claims['Date de naissance'][0].value.should.equal('1793')
      done()
    })

    it('should not include empty values', done => {
      const item = parseNotice(sampleBnfPepAvecDateApproximative).items[0]
      should(item.claims['Date de décès']).not.be.ok()
      done()
    })
  })
})
