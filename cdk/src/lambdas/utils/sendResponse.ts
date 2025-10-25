export const sendResponse = (statusCode: number, data: any) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Credentials": "true",
    },
    body: JSON.stringify(data),
  };
};
