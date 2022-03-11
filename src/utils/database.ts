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
  REVIEWS = "reviews",
}

enum PhoneTableColumns {
  ID = "id",
  MODEL = "model",
  BRAND = "brand",
  PRICE_RANGE = "price_range",
}

enum ReviewsTableColumns {
  REVIEW_ID = "review_id",
  PHONE_ID = "phone_id",
  RATE = "rate",
  REVIEW_TEXT = "review_text",
}

export const dbQueryGetPhones = (param?: string) => {
  const { PHONES, REVIEWS } = Tables;
  const { ID, BRAND, MODEL, PRICE_RANGE } = PhoneTableColumns;
  const { PHONE_ID, RATE, REVIEW_ID } = ReviewsTableColumns;
  const baseQuery = `SELECT ${ID}, ${MODEL}, ${BRAND}, ${PRICE_RANGE}, ROUND(AVG(${RATE}), 1) AS avg_rate, (SELECT COUNT(${REVIEW_ID})::INT FROM ${REVIEWS} WHERE ${PHONE_ID} = ${ID}) AS reviews_count FROM ${PHONES} p LEFT JOIN ${REVIEWS} ON ${ID} = ${PHONE_ID}`;
  const groupingQuery = `GROUP BY p.${ID}, p.${MODEL}, p.${BRAND}, p.${PRICE_RANGE}`;
  if (param) return `${baseQuery} WHERE REPLACE(LOWER(${BRAND}), ' ', '' ) = $1 OR REPLACE(LOWER(${MODEL}), ' ', '' ) = $1 OR ${PRICE_RANGE}::text = $1 ${groupingQuery}`;
  return `${baseQuery} ${groupingQuery}`;
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
