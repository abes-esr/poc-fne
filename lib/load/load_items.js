const config = require('../config')
const loadItem = require('./load_item')
const loadRelation = require('./load_relation')
const loadSequentially = require('./load_sequentially')
const wikibase = require('../wikibase')
const { get } = require('../request')
const { keyBy, map } = require('lodash')

module.exports = (items, relations, wbProps) => {
  return loadSequentially(loadItem, items, wbProps)
  .then((wbItems) => {
    const itemsByPseudoIds = keyBy(wbItems, 'pseudoId')
    return loadSequentially(loadRelation, relations, itemsByPseudoIds, wbProps)
    .then(relationsRes =>  {
      const ids = map(wbItems, 'id')
      return wikibase.getEntities(ids)
      .then(attachRelations(relationsRes))
    })
  })
}

const attachRelations = (relations) => (entities) => ({ entities, relations })