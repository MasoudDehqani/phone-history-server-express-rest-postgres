export enum CRUDMethods {
  GET = "GET",
  POST = "POSST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type BodyType = {
  id: string,
  brand: string,
  model: string,
  priceRange: number
};

enum Tables {
  PHONES = "phones",
}

export const dbQueryGet = (param?: string) => {
  if (param) return `SELECT * FROM ${Tables.PHONES} WHERE REPLACE(LOWER(brand), ' ', '' ) = $1 OR REPLACE(LOWER(model), ' ', '' ) = $1 OR price_range::text = $1`;
  return `SELECT * FROM ${Tables.PHONES}`;
};

export const dbQueryPost = (body: BodyType) : [string, (string | number)[]] => {
  const { brand, model, priceRange } = body;
  const query = "INSERT INTO phones(brand, model, price_range) VALUES ($1, $2, $3) RETURNING id";
  const values = [brand, model, priceRange];
  console.log(typeof priceRange);
  return [query, values];
};

export const dbQueryDelete = (): string => {
  const query = `DELETE FROM ${Tables.PHONES} WHERE id = $1`;
  return query;
};

export const dbQueryPut = (body: BodyType): [string, (string | number)[]] => {
  const bodyKeyValuePairs = Object.entries(body).filter(([key, _]) => key !== "id");
  const updatedValues = bodyKeyValuePairs.map(([key, _], i) => `${key} = $${i + 2}`);
  const fieldValues = bodyKeyValuePairs.map(([_, value]) => value);
  const updateCommand = updatedValues.reduce((currentValue, acc, index) => {
    if (index === 0) return currentValue;
    return currentValue.concat(", ", acc);
  });

  const query = `UPDATE ${Tables.PHONES} SET ${updateCommand} WHERE id = $1`;
  const values = [body.id, ...fieldValues];

  return [query, values];
};

export default {
  dbQueryGet,
};
