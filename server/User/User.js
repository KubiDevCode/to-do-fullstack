import mongoose from 'mongoose';

const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "USER" }
})

export default mongoose.model('User', User)