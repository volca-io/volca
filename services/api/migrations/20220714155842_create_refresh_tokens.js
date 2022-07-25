const TABLE_NAME = 'refresh_tokens';

exports.up = function up(knex) {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('session_id').notNullable();
    table.string('subject').notNullable();
    table.string('token').unique().notNullable();
    table.timestamp('expires_at').notNullable();
    table.index('token', 'token_index');
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable(TABLE_NAME);
};
