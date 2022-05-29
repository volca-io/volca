const TABLE_NAME = 'users';

exports.up = function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').nullable();
    table.string('salt').nullable();
    table.string('name').nullable();
  });
};

exports.down = async function down(knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
