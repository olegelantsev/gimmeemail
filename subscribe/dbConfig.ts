
let cosmosDbConfig: any = {};

cosmosDbConfig.host = process.env.HOST;
cosmosDbConfig.authKey = process.env.AUTH_KEY;
cosmosDbConfig.databaseId = process.env.DATABASE_ID;
cosmosDbConfig.containerId = process.env.CONTAINER_ID;

export {cosmosDbConfig};