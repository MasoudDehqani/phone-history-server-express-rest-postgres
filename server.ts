import 'dotenv/config';
import express from 'express';

const app = express();

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
