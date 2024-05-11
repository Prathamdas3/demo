const { GRPC } = require("@cerbos/grpc");
const cerbos = new GRPC("localhost:3593", { tls: false });

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
  };
};

/**
 * Asynchronous function to check if a user has read access to a resource.
 *
 * @param {Object} req - The request object, containing user and resource information.
 * @param {Object} res - The response object, used to send the response back to the client.
 * @param {Function} next - The next middleware function in the Express.js routing pipeline.
 * @returns {Promise} - A promise that resolves to the next middleware function if the user is authorized, or an error message if not.
 */
async function readAccess(req, res, next) {
  const decision = await cerbos.checkResource({
    principal: jwtToPrincipal(req.user),
    resource: {
      kind: "contact",
      id: req.user.id,
      attributes: req.user,
    },
    actions: ["read"],
  });

  if (decision.isAllowed("read")) {
      next();
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
  }

  async function writeAccess(req, res, next) {
    const decision = await cerbos.checkResource({
      principal: jwtToPrincipal(req.user),
      resource: {
        kind: "contact",
        id: req.user.id,
        attributes: req.user,
      },
      actions: ["create"],
    });
  
    if (decision.isAllowed("create")) {
      next();
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  }

module.exports = {readAccess, writeAccess};