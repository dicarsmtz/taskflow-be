import { Model, snakeCaseMappers } from 'objection';

// avoids type checks and complex conversions
interface OmitFields {
  [key: string]: boolean;
}
export interface Omits {
  json?: OmitFields;
  database?: OmitFields;
}

// Can't create model properties as objection.js tries to treat them as db columns
const _jsonOmitted = Symbol('_jsonOmitted');
const _databaseJsonOmitted = Symbol('_databaseJsonOmitted');

class BaseModel extends Model {
  id!: number;
  createdAt?: string;
  updatedAt?: string;

  static get idColumn() {
    return 'id';
  }

  get jsonOmitted(): boolean {
    return Boolean(this[_jsonOmitted]);
  }

  get databaseJsonOmitted(): boolean {
    return Boolean(this[_databaseJsonOmitted]);
  }

  get modelOmits(): Omits {
    return {
      json: {},
      database: {},
    };
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  private get omits(): Omits {
    const currentOmits = Object.entries(this.modelOmits);
    const baseOmits: Omits = {
      json: {
        password: true,
      },
      database: {},
    };
    const finalOmits = currentOmits.reduce((acc, [key, value]) => {
      const newOmits: Omits = {
        ...acc,
        [key]: { ...acc[key], ...value } as OmitFields,
      };
      return newOmits;
    }, baseOmits);
    return finalOmits;
  }

  omitFromJson(keys: OmitFields = {}): this {
    const finalOmits = { ...this.omits.json, ...keys };
    const result = this.$omitFromJson(finalOmits);
    this[_jsonOmitted] = true;
    return result;
  }

  omitFromDatabaseJson(keys: OmitFields = {}): this {
    const finalOmits = { ...this.omits.database, ...keys };
    const result = this.$omitFromDatabaseJson(finalOmits);
    this[_databaseJsonOmitted] = true;
    return result;
  }

  // override to force UTC
  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  // override to force UTC
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  get createdAtDate() {
    return this.createdAt ? new Date(this.createdAt) : null;
  }

  get updatedAtDate() {
    return this.updatedAt ? new Date(this.updatedAt) : null;
  }
}

export default BaseModel;
