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
  PHONE_ID = "phone_id",
  MODEL = "model",
  BRAND = "brand",
  PRICE_RANGE = "price_range",
}

enum ReviewsTableColumns {
  REVIEW_ID = "review_id",
  PHONE_ID_FK = "phone_id_fk",
  REVIEW_RATE = "review_rate",
  REVIEW_TEXT = "review_text",
}

export const dbQueryGetPhones = (param?: string) => {
  const { PHONES, REVIEWS } = Tables;
  const { PHONE_ID, BRAND, MODEL, PRICE_RANGE } = PhoneTableColumns;
  const { PHONE_ID_FK, REVIEW_RATE, REVIEW_ID } = ReviewsTableColumns;
  const baseQuery = `SELECT ${PHONE_ID} as "phoneId", ${MODEL}, ${BRAND}, ${PRICE_RANGE} as "priceRange", ROUND(AVG(${REVIEW_RATE}), 1) AS "avgRate", (SELECT COUNT(${REVIEW_ID})::INT FROM ${REVIEWS} WHERE ${PHONE_ID_FK} = ${PHONE_ID}) AS "reviewsCount" FROM ${PHONES} p LEFT JOIN ${REVIEWS} ON ${PHONE_ID} = ${PHONE_ID_FK}`;
  const groupingQuery = `GROUP BY p.${PHONE_ID}, p.${MODEL}, p.${BRAND}, p.${PRICE_RANGE}`;
  if (param) return `${baseQuery} WHERE REPLACE(LOWER(${BRAND}), ' ', '' ) = $1 OR REPLACE(LOWER(${MODEL}), ' ', '' ) = $1 OR ${PRICE_RANGE}::text = $1 ${groupingQuery}`;
  return `${baseQuery} ${groupingQuery}`;
};

export const dbQueryGetReviews = (param: string) => {
  const query = `SELECT brand, model, review_text, rate, review_id FROM phones LEFT JOIN reviews ON id = phone_id WHERE id = $1`;
  return query;
};

export const dbQueryPostPhone = (body: PhoneBodyType) : [string, (string | number)[]] => {
  const { brand, model, priceRange } = body;
  const query = "INSERT INTO phones(brand, model, price_range) VALUES ($1, $2, $3) RETURNING phone_id";
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
  const query = `DELETE FROM ${Tables.PHONES} WHERE phone_id = $1`;
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
