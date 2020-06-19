exports.seed = function (knex) {
  return knex("departments").insert([
    { name: "Accounting" },
    { name: "Marketing" },
    { name: "Legal" },
    { name: "Engineering" },
  ]);
};
