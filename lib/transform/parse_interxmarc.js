const { flatten } = require('lodash')
const schema = 'interxmarc'

module.exports = notice => {
  return flatten(parseFields(notice))
  .reduce((obj, id) => {
    obj[id] = { id, datatype: 'string', aliases: { fr: id } }
    return obj
  }, {})
}

const parseFields = notice => notice.datafield.map(parseSubfields)

const parseSubfields = field => {
  const { tag, subfield: subfields } = field
  return forceArray(subfields)
  .map((subfield, index) => `${schema}:${tag}:${subfield.code}:${index}`)
}

const forceArray = obj => obj instanceof Array ? obj : [ obj ]