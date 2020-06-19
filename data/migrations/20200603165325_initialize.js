exports.up = function (knex) {
  return knex.schema
    .createTable("departments", tbl => {
      tbl.increments("id");
      tbl.string("name").notNullable();
    })
    .createTable("users", tbl => {
      tbl.increments("id");
      tbl.string("username").notNullable();
      tbl.string("password").notNullable();
      tbl
        .integer("department_id")
        .notNullable()
        .unsigned()
        .references("departments.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("departments");
};
