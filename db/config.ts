import { Pool, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

export default class DB {
  private pool: Pool;

  private DBConfig = {
    user: process.env.DB_USERNAME || "DonAdmin",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "blockb-test",
    password: process.env.DB_PASSWORD || "P@ssw0rd123!",
    port: Number(process.env.DB_PORT) || 54321,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    allowExitOnIdle: false,
  };

  async getDBConnection(): Promise<PoolClient> {
    if (!this.pool) {
      this.pool = new Pool(this.DBConfig);
      const client = await this.pool.connect();
      console.log(`---------> √ DB connection has been established! <---------`)
      return client;
    } else {
      return this.pool.connect();
    }
  }

  async executeQuery(query: string): Promise<QueryResult | undefined> {
    try {
      const client: PoolClient = await this.getDBConnection();
      const result: QueryResult = await client.query(query);
      return result
    } catch (error) {
      console.error("Error executing query:", error);
      return undefined
    }
  }
}