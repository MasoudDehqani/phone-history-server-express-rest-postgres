import 'dotenv/config';
import express from 'express';
import db from './db';

const app = express();

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
console.log(process.env.USER);

app.use(express.json());
app.use((req, res, next) => {
  console.log('middleware');
  next();
});

app.get('/api/v1/products', async (req, res) => {
  const queryResult = await db.query('SELECT * FROM products');
  res.status(200).json({
    status: 'success',
    data: {
      products: queryResult.rows,
    },
  });
});

app.get('/api/v1/products/:id', (req, res) => {
  console.log(req.params.id);
});

app.post('api/v1/products', (req, res) => {
  console.log(req.body);
});

app.put('api/v1/products/:id', (req, res) => {
  console.log(req.body);
});

app.delete('api/v1/products/:id', (req, res) => {
  console.log(req.params);
});
