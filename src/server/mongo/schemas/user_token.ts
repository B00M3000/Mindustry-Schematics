import mongoose from "mongoose";

const schema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	token: {
		type: String,
		unique: true,
		required: true,
	},
	access: {
		type: String,
		required: true,
	},
});
export interface UserTokenDocument extends mongoose.Document {
	username: string;
	token: string;
	access: string;
}

export const UserTokenSchema: mongoose.Model<UserTokenDocument> =
	mongoose.models["User Tokens"] || mongoose.model("User Tokens", schema);
