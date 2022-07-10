const TABLE_NAME = 'users';

exports.up = function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('email').unique().notNullable();
    table.string('password').nullable();
    table.string('first_name').nullable();
    table.string('last_name').nullable();
  });
};

exports.down = async function down(knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
