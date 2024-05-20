import { QueryResult } from "pg";
import DB from "./config";

const connectToDB = new DB();

async function establishDBConnection() {
	try {
		await connectToDB.getDBConnection();
	} catch (error) {
		console.log(`---------> X Failed to connect to dataBase <--------- \n\n ${error}`);
		process.exit(1);
	}
}

export const fetchResetIDByEmail = async (email: string): Promise<QueryResult | undefined> => {
	await establishDBConnection();
	const resetId = await connectToDB.executeQuery(`SELECT reset_id
	FROM reset_user_password as r
	JOIN users ON users.id = r.user_id
	WHERE users.email = '${email}'
	ORDER BY r.id DESC`);

	return resetId;
};

export const createTransactionTestData = async (email: string) => {
	// await establishDBConnection();

	// Get user contract id
	const contractId = await connectToDB.executeQuery(`SELECT con.contract_id
	FROM contracts as con
	JOIN customers as cus ON cus.id = con.customer_id
	WHERE cus.email = '${email}'
	LIMIT 1`);

	// Create transaction test data
	const toInsert: {
		daily_payout: number;
		book_type: string;
		contract_id: string;
		book_date: Date;
		book_id: number;
	}[] = [];

	for (let index = 0; index < 99; index++) {
		toInsert.push({
			daily_payout: 10,
			book_type: "sell",
			contract_id: contractId?.rows[0].contract_id,
			book_date: new Date(),
			book_id: index + 1
		});
	}

	const queryText = `INSERT INTO transactions (daily_payout, book_type, contract_id, book_date, book_id) VALUES ${toInsert.map((row) => `(${row.daily_payout}, '${row.book_type}', '${row.contract_id}', NOW(), ${row.book_id})`).join(',')}`;
	await connectToDB.executeQuery(queryText);
};

export const cleanupTransactionTestData = async (email: string) => {
	await establishDBConnection();
	// Get user contract id
	const contractId = await connectToDB.executeQuery(`SELECT con.contract_id
	FROM contracts as con
	JOIN customers as cus ON cus.id = con.customer_id
	WHERE cus.email = '${email}'
	LIMIT 1`);

	// Create transaction test data
	// await connectToDB.getDBConnection.hel;
	await connectToDB.executeQuery(`DELETE FROM transactions
	WHERE contract_id = '${contractId?.rows[0].contract_id}'`);
};
