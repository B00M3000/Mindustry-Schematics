import dotenv from "dotenv";
import path from "path";
function configEnv(): dotenv.DotenvParseOutput {
	return (
		dotenv.config({
			path: path.resolve(".env"),
		}).parsed || {}
	);
}
const env = configEnv();
export default env;
