const knex = require("./dbConfig");

function addUser(user) {
  return knex("users")
    .insert(user, ["id"])
    .then(([id]) => getUser({ id }));
}

function getUsers() {
  return knex("users as u")
    .join("departments as d", "u.department_id", "d.id")
    .select("u.username", "u.password", "d.name as department")
    .then(users => users.map(({ password, ...user }) => user));
}

function getUser(user) {
  return knex("users as u")
    .where(user.id ? { "u.id": user.id } : user)
    .join("departments as d", "u.department_id", "d.id")
    .select("u.username", "u.password", "d.name as department")
    .first();
}

function getDepartment(dept) {
  return knex("departments")
    .where(dept)
    .first()
    .then(d => d || null);
}

module.exports = { addUser, getUsers, getUser, getDepartment };
