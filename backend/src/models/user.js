import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "manager", "waiter"],
        default: "waiter"
    },
    active: {
        type: Boolean,
        default: true
    },
    company: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);