const TABLE_NAME = 'users';

exports.up = function up(knex) {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.string('stripe_id').nullable();
  });
};

exports.down = async function down(knex) {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropColumn('stripe_id');
  });
};
