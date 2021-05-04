import dotenv from "dotenv";
import path from "path";
import fs from "fs";

function configEnv(): dotenv.DotenvParseOutput {
  if(path.resolve(".env.dev")){
    return (
      dotenv.config({
  			path: path.resolve(".env.dev"),
  		}).parsed || {}
    )
  } else {
    return (
  		dotenv.config({
  			path: path.resolve(".env"),
  		}).parsed || {}
  	);
  }
}

const env = configEnv();
export default env;
