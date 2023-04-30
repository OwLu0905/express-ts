declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: number;
			MONGODB_PASS: string;
			MONGODB_URL: string;
			DATABASE_LOCAL: string;
		}
	}
}
export {}
