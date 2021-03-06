'use strict'
const ourJoi = module.exports = { }

const Joi = require('joi')

ourJoi._joiBase = resourceName => {
  const relationType = Joi.object().keys({
    id: Joi.string().required(),
    type: Joi.any().required().valid(resourceName),
    meta: Joi.object().optional()
  })
  return relationType
}
Joi.one = resource => {
  if (typeof resource !== 'string') throw new Error('Expected a string when defining a primary relation via .one()')
  const obj = Joi.alternatives().try(
    Joi.any().valid(null), // null
    ourJoi._joiBase(resource)
  )
  obj._settings = {
    __one: resource
  }
  return obj
}
Joi.many = resource => {
  if (typeof resource !== 'string') throw new Error('Expected a string when defining a primary relation via .many()')
  const obj = Joi.array().items(ourJoi._joiBase(resource))
  obj._settings = {
    __many: resource
  }
  return obj
}
Joi._validateForeignRelation = config => {
  if (!config.as) throw new Error("Missing 'as' property when defining a foreign relation")
  if (!config.resource) throw new Error("Missing 'resource' property when defining a foreign relation")
}
Joi.belongsToOne = config => {
  Joi._validateForeignRelation(config)
  const obj = Joi.alternatives().try(
    Joi.any().valid(null), // null
    ourJoi._joiBase(config.resource)
  )
  obj._settings = {
    __one: config.resource,
    __as: config.as
  }
  return obj
}
Joi.belongsToMany = config => {
  Joi._validateForeignRelation(config)
  const obj = Joi.array().items(ourJoi._joiBase(config.resource))
  obj._settings = {
    __many: config.resource,
    __as: config.as
  }
  return obj
}
ourJoi.Joi = Joi
