export enum CRUDMethods {
  GET = 'GET',
  POST = 'POSST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const getDBQueryArgs = (param: string, method: CRUDMethods): [string, string | number] => {
  const isParamNumber = !Number.isNaN(Number(param));
  const queryParam = isParamNumber ? Number(param) : param;
  const queryStringStart = () => {
    if (method === CRUDMethods.GET) return 'SELECT * FROM';
    // if (method === CRUDMethods.DELETE) return 'DELETE FROM';
    return 'DELETE FROM';
  };
  const queryByID = `${queryStringStart()} phones WHERE id = $1`;
  const queryByName = `${queryStringStart()} phones WHERE brand = $1 OR model = $1`;
  const queryString = isParamNumber ? queryByID : queryByName;
  return [queryString, queryParam];
};

export default {
  getDBQueryArgs,
};
