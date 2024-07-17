import { Schema, Model, model, Types, DefaultSchemaOptions } from "mongoose";
import bcrypt from "bcrypt";
import { UserRoles } from "../../util/constant";

export interface IUser {
	id: string;
	email: string;
	username: string;
	password: string;
	phoneNumber: string;
	role: string;
	orders: [Types.ObjectId];
	events: [Types.ObjectId];
	createdAt: Date;
	updatedAt: Date;
}

interface IUserMethods {
	isValidPassword(): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		phoneNumber: {
			type: String,
			unique: true,
			trim: true,
		},
		role: {
			type: String,
			enum: [UserRoles.Creator, UserRoles.Eventee],
			default: UserRoles.Eventee,
		},
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: "Order",
			},
		],
		events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next): Promise<void> {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
	next();
});

UserSchema.method("isValidPassword", async function (password: string) {
	const user = this;
	const compare: boolean = await bcrypt.compare(password, user.password);

	return compare;
});

UserSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (_, ret) {
		delete ret._id;
		delete ret["password"];
		return ret;
	},
});

const User = model<IUser, UserModel>("User", UserSchema);

export default User;
