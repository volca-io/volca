const TABLE_NAME = 'project_invitations';

exports.up = function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.uuid('project_id').notNullable().index().references('id').inTable('projects');
    table.uuid('from_user_id').notNullable().index().references('id').inTable('users');
    table.uuid('to_user_id').notNullable().index().references('id').inTable('users');
    table.uuid('key').defaultTo(knex.raw('uuid_generate_v4()')).notNullable();
    table.timestamp('expires_at').notNullable();
  });
};

exports.down = async function down(knex) {
  return knex.schema.dropTable(TABLE_NAME);
};
