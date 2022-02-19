import { Pool } from 'pg';

const pool = new Pool();

const query = (
  text: string,
  params?: any,
) => pool.query(text, params);

export default {
  query,
};

// module.exports = {
//   query: (text: string, params: string) => pool.query(text, params),
// };
