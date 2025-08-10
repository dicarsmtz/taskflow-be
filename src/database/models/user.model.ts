import BaseModel from './base.model';

class User extends BaseModel {
  firstName!: string;
  lastName!: string;
  dateOfBirth?: string;
  slug!: string;
  email!: string;
  password!: string;
  profileImageUrl?: string;
  coverImageUrl?: string;

  static get tableName() {
    return 'users';
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'slug', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1, maxLength: 50 },
        lastName: { type: 'string', minLength: 1, maxLength: 50 },
        dateOfBirth: { type: ['string', 'null'], format: 'date' },
        email: { type: 'string' },
        slug: { type: 'string' },
        password: { type: 'string', minLength: 8, maxLength: 64 },
        profileImageUrl: { type: ['string', 'null'] },
        coverImageUrl: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}

export default User;
