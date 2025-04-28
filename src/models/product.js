import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["food", "drink"],
        required: true,
    },
    category: {
        type: String, // Example_: soda, meat, etc.
        required: true,
    }}, { timestamps: true });

export default mongoose.model("Product", productSchema);