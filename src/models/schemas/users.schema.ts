import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { UserRoles } from "../../util/constant";

const UserSchema = new Schema(
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

UserSchema.methods.isValidPassword = async function (
	password: string
): Promise<boolean> {
	const user = this;
	const compare: boolean = await bcrypt.compare(password, user.password);

	return compare;
};

UserSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (_, ret) {
		delete ret._id;
		delete ret["password"];
		return ret;
	},
});

const User = model("User", UserSchema);

export default User;
