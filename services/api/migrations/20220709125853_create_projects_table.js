const TABLE_NAME = 'projects';

exports.up = function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').primary();
    table.string('name').unique().notNullable();
    table.uuid('admin_id').notNullable().index().references('id').inTable('users');
  });
};

exports.down = async function down(knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
