const { GRPC } = require('@cerbos/grpc')
const cerbos = new GRPC('localhost:3593', { tls: false })

/**
 * This function converts a JWT (JSON Web Token) to a principal object.
 *
 * @param {Object} param0 - An object that represents the JWT.
 * @param {string} param0.id - The ID from the JWT.
 * @param {number} param0.iat - The issued at time from the JWT.
 * @param {Array} param0.roles - The roles from the JWT. Defaults to an empty array if not provided.
 * @param {Object} param0.rest - The rest of the attributes from the JWT.
 *
 * @returns {Object} - Returns a principal object with id, roles, and attributes.
 */

const jwtToPrincipal = ({ id, iat, roles = [], ...rest }) => {
  return {
    id: id,
    roles,
    attributes: rest,
  }
}

async function readAccess(req, res, next) {
  const blog = await Blog.findOne(req.params.id)
  const decision = await cerbos.checkResource({
    principal: jwtToPrincipal(req.user),
    resource: {
      kind: 'contact',
      id: req.user.id,
      attributes: req.user,
    },
    actions: ['read'],
  })

  if (decision.isAllowed('read')) {
    next()
  } else {
    return res.status(403).json({ error: 'Unauthorized' })
  }
}

async function writeAccess(req, res, next) {
  const decision = await cerbos.checkResource({
    principal: jwtToPrincipal(req.user),
    resource: {
      kind: 'contact',
      id: req.user.id,
      attributes: req.user,
    },
    actions: ['create'],
  })

  if (decision.isAllowed('create')) {
    next()
  } else {
    return res.status(403).json({ error: 'Unauthorized' })
  }
}
async function updateAccess(req, res, next) {
  const decision = await cerbos.checkResource({
    principal: jwtToPrincipal(req.user),
    resource: {
      kind: 'contact',
      id: req.user.id,
      attributes: req.user,
    },
    actions: ['update'],
  })

  if (decision.isAllowed('update')) {
    next()
  } else {
    return res.status(403).json({ error: 'Unauthorized' })
  }
}
async function deleteAccess(req, res, next) {
  const decision = await cerbos.checkResource({
    principal: jwtToPrincipal(req.user),
    resource: {
      kind: 'contact',
      id: req.user.id,
      attributes: req.user,
    },
    actions: ['delete'],
  })

  if (decision.isAllowed('delete')) {
    next()
  } else {
    return res.status(403).json({ error: 'Unauthorized' })
  }
}

module.exports = { readAccess, writeAccess, deleteAccess, updateAccess }
