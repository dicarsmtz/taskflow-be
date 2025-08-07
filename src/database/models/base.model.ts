import { Model } from 'objection';

// avoids type checks and complex conversions
type OmitFields = { [key: string]: boolean };
type Omits = {
  json: OmitFields;
  database: OmitFields;
};

class BaseModel extends Model {
  id!: number;
  createdAt?: string;
  updatedAt?: string;

  static get idColumn() {
    return 'id';
  }

  get modelOmits(): Omits {
    return {
      json: {},
      database: {},
    };
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

  $omitFromJson(keys: OmitFields): this {
    const finalOmits = { ...this.omits.json, ...keys };
    return super.$omitFromJson(finalOmits);
  }

  $omitFromDatabaseJson(keys: OmitFields): this {
    const finalOmits = { ...this.omits.json, ...keys };
    return super.$omitFromDatabaseJson(finalOmits);
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
