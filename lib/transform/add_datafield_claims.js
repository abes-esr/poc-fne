const { addSubfieldsClaims } = require('./claims')
const modelizedFieldParsers = require('./modelized_field_parsers')
const maxLength = 400

module.exports = (schema, noticeType, claims, datafields) => {
  const schemaModelizedFieldParsers = modelizedFieldParsers[schema].datafield
  datafields.map(field => {
    const { tag, subfields } = field
    const modelizedFieldParser = schemaModelizedFieldParsers[tag]
    subfields.map(trunctateSubfield)
    if (modelizedFieldParser) {
      modelizedFieldParser(noticeType, tag, subfields, claims)
    } else {
      addSubfieldsClaims(schema, claims, subfields, tag)
    }
  })
}

const trunctateSubfield = (subfield) => {
  // Il est convenu de tronquer les string qui posent problème. source: https://github.com/abes-esr/poc-fne/issues/217
  var { $t } = subfield
  if (!$t) return
  if ($t.length > maxLength) subfield.$t = $t.slice(0, maxLength)
}
