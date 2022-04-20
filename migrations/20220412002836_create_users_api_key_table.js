async function up(knex) {
  return knex.schema.createTable("users_api_key", function (table) {
    table.specificType("twitch_id", "char(32)");
    table
      .foreign("twitch_id")
      .references("twitch_id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table.integer("created_at").unsigned().notNullable();
    table.integer("modified_at").unsigned().notNullable();

    table.specificType("api_key", "char(24)").notNullable();
    table.index(["api_key"]);
  });
}
module.exports.up = up;

async function down(knex) {
  knex.schema.dropTable("users_api_key");
}
module.exports.down = down;
