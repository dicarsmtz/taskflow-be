import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('first_name', 50).notNullable();
    table.string('last_name', 50).notNullable();
    table.date('date_of_birth').nullable();
    table
      .string('slug', 30)
      .unique({ indexName: 'uq_users_slug' })
      .notNullable();
    table.string('email').unique({ indexName: 'uq_users_email' }).notNullable();
    table.string('password').notNullable();
    table.text('profile_image_url').nullable();
    table.text('cover_image_url').nullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
