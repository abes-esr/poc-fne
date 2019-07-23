require('should')
const lesReveriesDuPromeneur = require('../echantillons/LesReveriesDuPromeneur_BnF_11935154.json')
const parseProperties = require('../lib/transform/parse_properties')
const parseNotice = require('../lib/transform/parse_notice')
const loadProperties = require('../lib/load/load_properties')
const loadItems = require('../lib/load/load_items')

describe('load items on wikibase', function () {
  this.timeout(20000)

  it('should return a list of items', done => {
    const itemPseudoId = '.0..b.fre..Les rêveries du promeneur solitaire'
    const properties = parseProperties(lesReveriesDuPromeneur)
    const { items, relations } = parseNotice(lesReveriesDuPromeneur)

    loadProperties(properties)
      .then((wbProps) => {
        return loadItems(items, relations, wbProps)
          .then((res) => {
            const entities = Object.values(res.entities)
            const item = entities[0]
            item.labels.en.value.should.equal(itemPseudoId)
            done()
          })
      })
      .catch(done)
  })

  it('should return a list of items with relations', done => {
    const relationProperty = 'interxmarc:s:100'
    const properties = parseProperties(lesReveriesDuPromeneur)
    const { items, relations } = parseNotice(lesReveriesDuPromeneur)

    loadProperties(properties)
      .then((wbProps) => {
        return loadItems(items, relations, wbProps)
          .then((res) => {
            const workId = res.relations[0].claim.id.split('$')[0]
            const authorId = res.relations[0].claim.mainsnak.datavalue.value.id
            res.entities[workId].labels.en.value.should.equal(relations[0].subject)
            res.entities[authorId].labels.en.value.should.equal(relations[0].object)
            done()
          })
      })
      .catch(done)
  })
})
