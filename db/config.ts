import { Pool, PoolClient, QueryResult } from "pg";

export default class DB {
  private pool: Pool;

  private DBConfig = {
    user: "DonAdmin",
    host: "localhost",
    database: "blockb-test",
    password: "P@ssw0rd123!",
    port: 5432,
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

  async executeQuery(query: string): Promise<void> {
    try {
      const client: PoolClient = await this.getDBConnection();
      const result: QueryResult = await client.query(query);
      console.log(result.rows);
    } catch (error) {
      console.error("Error executing query:", error);
    }
  }
}