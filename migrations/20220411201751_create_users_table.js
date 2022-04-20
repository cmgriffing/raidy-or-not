async function up(knex) {
  const createdTable = await knex.schema.createTable("users", function (table) {
    table.specificType("twitch_id", "char(32)");
    // .nonNullable()
    // .primary({ deferrable: "deferred" });
    table.specificType("twitch_name", "char(32)");
    // .notNullable();

    table.integer("created_at").unsigned().notNullable();
    table.integer("modified_at").unsigned().notNullable();
  });

  await knex.schema.alterTable("users", function (table) {
    table.dropNullable("twitch_id");
    table.dropNullable("twitch_name");
  });

  return knex.schema.alterTable("users", function (table) {
    table.primary(["twitch_id"]);
  });
}
module.exports.up = up;

async function down(knex) {
  knex.schema.dropTable("users");
}
module.exports.down = down;
