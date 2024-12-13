import express from "express";
import mongoose, { PipelineStage, Schema } from "mongoose";

mongoose.connect("mongodb://localhost:27017/temp").then();

const userSchema = new Schema(
	{
		name: String,
		email: { type: String, required: true },
		orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

const orderSchema = new Schema(
	{
		amount: Number,
		user: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);

const app = express();

app.get("/latest_orders", async (req, res) => {
	const pipeline: PipelineStage[] = [
		{ $sort: { createdAt: -1 } },
		{
			$group: {
				_id: "$user",
				order_id: { $first: "$_id" },
				amount: { $first: "$amount" },
				createdAt: { $first: "$createdAt" },
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "_id",
				foreignField: "_id",
				as: "userDetails",
			},
		},
		{
			$project: {
				order_id: 1,
				amount: 1,
				name: { $arrayElemAt: ["$userDetails.name", 0] },
				email: { $arrayElemAt: ["$userDetails.email", 0] },
			},
		},
	];

	try {
		const orders = await Order.aggregate(pipeline);
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch latest orders" });
	}
});
