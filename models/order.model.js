import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		stripeSessionId: {
			type: String,
			unique: true,
		},
		status: {
			type: String,
			enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
		paymentStatus: {
			type: String,
			enum: ["paid", "unpaid"],
			default: "paid",
		},
		shippingAddress: {
			type: {
				name: { type: String, required: true },
				address: { type: String, required: true },
				city: { type: String, required: true },
				state: { type: String, required: true },
				zipCode: { type: String, required: true },
				country: { type: String, required: true },
			},
			required: true,
		},
		trackingNumber: {
			type: String,
			unique: true,
			sparse: true, // Allows null values without index conflict
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;