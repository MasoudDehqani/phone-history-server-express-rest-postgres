import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db";
import {
  dbQueryDelete, dbQueryGet, dbQueryPost, dbQueryPut,
} from "./src/utils/database";

const app = express();

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
console.log(process.env.USER);

app.use(express.json());
app.use((req, res, next) => {
  console.log("middleware");
  next();
});

app.use(cors());

app.get("/api/v1/phones", async (_, res) => {
  const query = dbQueryGet();
  const allPhones = await db.query(query);

  res.status(200).json({
    status: "success",
    data: {
      phones: allPhones.rows,
    },
  });
});

app.get("/api/v1/phones/:searchParam", async (req, res) => {
  const { searchParam } = req.params;
  const query = dbQueryGet(searchParam);
  const queryResult = await db.query(query, [searchParam.toLowerCase().replace(/\s/g, "")]);

  res.status(200).json({
    status: "success",
    data: {
      phones: queryResult.rows,
    },
  });
});

app.post("/api/v1/phones", async (req, res) => {
  const [query, values] = dbQueryPost(req.body);
  const phone = await db.query(query, values);

  res.status(201).json({
    status: "success",
    data: {
      id: phone.rows[0].id,
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
  console.log(query, req.body);
  db.query(query, [req.body.id]);

  res.status(200).json({
    status: "success",
  });
});
