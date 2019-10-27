import { CosmosClient } from "@azure/cosmos";
import { cosmosDbConfig } from './dbConfig';

class DbRepository {
    client: CosmosClient;
    databaseId: string;
    database = null;
    collectionId = null;
    container = null;

    constructor(docClient: CosmosClient, databaseId: string, containerId: string) {
        this.client = docClient;
        this.databaseId = databaseId;
        this.collectionId = containerId;
    }

    async init() {
        const dbResponse = await this.client.databases.createIfNotExists({
            id: this.databaseId
        });
        this.database = dbResponse.database;
        const coResponse = await this.database.containers.createIfNotExists({
            id: this.collectionId
        });
        this.container = coResponse.container;
    }

    async addItem(item) {
        item.date = Date.now();
        item.completed = false;
        const { resource: doc } = await this.container.items.create(item);
        return doc;
    }
}

let docDbClient = new CosmosClient({ endpoint: cosmosDbConfig.host, key: cosmosDbConfig.authKey });

let cosmosDb = new DbRepository(docDbClient, cosmosDbConfig.databaseId, cosmosDbConfig.containerId);
cosmosDb.init();

export { cosmosDb };
