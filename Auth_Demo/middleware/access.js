const { GRPC } = require("@cerbos/grpc");
const cerbos = new GRPC("localhost:3593", { tls: false });

const jwtToPrincipal = ({ id, iat, roles = [], ...rest }) => {
  return {
    id: id,
    roles,
    attributes: rest,
  };
};

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