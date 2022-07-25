const TABLE_NAME = 'users';

exports.up = function up(knex) {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.string('stripe_id').nullable();
    table.boolean('has_active_subscription').defaultTo(false);
    table.boolean('free_trial_activated').defaultTo(false);
  });
};

exports.down = async function down(knex) {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropColumn('stripe_id');
    table.dropColumn('has_active_subscription');
    table.dropColumn('free_trial_activated');
  });
};
