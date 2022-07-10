const TABLE_NAME = 'projects';

exports.up = function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('name').notNullable();
    table.uuid('admin_id').notNullable().index().references('id').inTable('users');
  });
};

exports.down = async function down(knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
