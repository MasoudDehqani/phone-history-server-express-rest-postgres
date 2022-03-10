import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db";
import {
  dbQueryDelete,
  dbQueryGetPhones,
  dbQueryGetReviews,
  dbQueryPostPhone,
  dbQueryPostReview,
  dbQueryPut,
} from "./src/utils/database";

const app = express();

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
// console.log(process.env.USER);

app.use(express.json());
app.use((req, res, next) => {
  console.log("middleware");
  next();
});

app.use(cors());

app.get("/api/v1/phones", async (_, res) => {
  const query = dbQueryGetPhones();
  const allPhones = await db.query(query);

  res.status(200).json({
    status: "success",
    data: {
      phones: allPhones.rows,
    },
  });
});

app.get("/api/v1/phones/:cat", async (req, res) => {
  const { cat } = req.params;
  const query = dbQueryGetPhones(cat);
  const queryResult = await db.query(query, [cat.toLowerCase().replace(/\s/g, "")]);

  res.status(200).json({
    status: "success",
    data: {
      phones: queryResult.rows,
    },
  });
});

app.get("/api/v1/reviews/:phoneId", async (req, res) => {
  const { phoneId } = req.params;
  const query = dbQueryGetReviews(phoneId);
  const reviews = await db.query(query, [phoneId]);

  res.status(200).json({
    status: "success",
    data: {
      brand: reviews.rows[0].brand,
      model: reviews.rows[0].model,
      noReview: !reviews.rows[0].review_id,
      reviews: reviews.rows,
    },
  });
});

app.post("/api/v1/phones", async (req, res) => {
  const [query, values] = dbQueryPostPhone(req.body);
  const phone = await db.query(query, values);

  res.status(201).json({
    status: "success",
    data: {
      id: phone.rows[0].id,
    },
  });
});

app.post("/api/v1/reviews/:phoneId", async (req, res) => {
  const [query, values] = dbQueryPostReview(req.body, req.params.phoneId);
  const reviewId = await db.query(query, values);

  res.status(200).json({
    status: "success",
    data: {
      reviewId: reviewId.rows[0],
    },
  });
});

app.put("/api/v1/phones", (req, res) => {
  const [query, values] = dbQueryPut(req.body);
  db.query(query, values);

  res.status(200).json({
    status: "succes",
  });
});

app.delete("/api/v1/phones", async (req, res) => {
  const query = dbQueryDelete();
  // console.log(query, req.body);
  db.query(query, [req.body.id]);

  res.status(200).json({
    status: "success",
  });
});
