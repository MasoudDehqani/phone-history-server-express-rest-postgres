import 'dotenv/config';
import express from 'express';
import db from './db';
import { getDBQueryArgs, CRUDMethods } from './src/utils/database';

const app = express();

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
console.log(process.env.USER);

app.use(express.json());
app.use((req, res, next) => {
  console.log('middleware');
  next();
});

app.get('/api/v1/phones', async (req, res) => {
  const allPhones = await db.query('SELECT * FROM phones');
  res.status(200).json({
    status: 'success',
    data: {
      phones: allPhones.rows,
    },
  });
});

app.get('/api/v1/phones/:searchTerm', async (req, res) => {
  const { searchTerm } = req.params;
  const [query, param] = getDBQueryArgs(searchTerm, CRUDMethods.GET);
  const queryResult = await db.query(query, [param]);

  res.status(200).json({
    status: 'success',
    data: queryResult.rows,
  });
});

app.post('/api/v1/phones', async (req, res) => {
  console.log(req.body);
  const { brand, model, priceRange } = req.body;
  db.query('INSERT INTO phones(brand, model, price_range) VALUES ($1, $2, $3)', [brand, model, priceRange]);
  res.status(201).json({
    status: 'success',
  });
});

app.put('/api/v1/phones/:id', (req, res) => {
  console.log(req.body);
});

app.delete('/api/v1/phones/:deleteParam', async (req, res) => {
  const { deleteParam } = req.params;
  const [query, param] = getDBQueryArgs(deleteParam, CRUDMethods.DELETE);
  const queryResult = await db.query(query, [param]);
  console.log(queryResult);
  res.status(200).json({
    status: 'success',
  });
});
