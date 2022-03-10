export enum CRUDMethods {
  GET = "GET",
  POST = "POSST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type PhoneBodyType = {
  id: string,
  brand: string,
  model: string,
  priceRange: number
};

type ReviewBodyType = {
  id: string,
  rate: string,
  review_text: string
};

enum Tables {
  PHONES = "phones",
}

export const dbQueryGetPhones = (param?: string) => {
  if (param) return `SELECT * FROM ${Tables.PHONES} WHERE REPLACE(LOWER(brand), ' ', '' ) = $1 OR REPLACE(LOWER(model), ' ', '' ) = $1 OR price_range::text = $1`;
  return `SELECT id, model, brand, price_range, ROUND(AVG(rate), 1) AS avg_rate, (SELECT COUNT(review_id)::INT FROM reviews WHERE phone_id = id) AS reviews_count FROM phones p LEFT JOIN reviews ON id = phone_id GROUP BY p.id, p.model, p.brand, p.price_range`;
};

export const dbQueryGetReviews = (param: string) => {
  const query = `SELECT brand, model, review_text, rate, review_id FROM phones LEFT JOIN reviews ON id = phone_id WHERE id = $1`;
  return query;
};

export const dbQueryPostPhone = (body: PhoneBodyType) : [string, (string | number)[]] => {
  const { brand, model, priceRange } = body;
  const query = "INSERT INTO phones(brand, model, price_range) VALUES ($1, $2, $3) RETURNING id";
  const values = [brand, model, priceRange];
  // console.log(typeof priceRange);
  return [query, values];
};

export const dbQueryPostReview = (body: ReviewBodyType, phoneId: string): [string, string[]] => {
  const { rate, review_text: reviewText } = body;
  const query = "INSERT INTO reviews(rate, review_text, phone_id) VALUES ($1, $2, $3) RETURNING review_id";
  const values = [rate, reviewText, phoneId];
  return [query, values];
};

export const dbQueryDelete = (): string => {
  const query = `DELETE FROM ${Tables.PHONES} WHERE id = $1`;
  return query;
};

export const dbQueryPut = (body: PhoneBodyType): [string, (string | number)[]] => {
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
  dbQueryGetPhones,
};
