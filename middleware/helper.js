var db = require("../models");
var User = db.user;
var Role = db.role;
var RoleAssigned = db.role_assigned;

var userHasRole = async (user_id, role_id) => {
  let user = await RoleAssigned.findOne({
    attributes: ["user_id", "role_id"],
    where: {
      user_id: user_id,
      role_id: role_id,
    },
  });
  if (user) return true;
  return false;
};
module.exports = { userHasRole };
