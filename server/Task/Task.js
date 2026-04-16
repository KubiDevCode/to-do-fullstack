import mongoose from 'mongoose';

const Task = new mongoose.Schema({
    task: { type: String, required: true },
    done: { type: Boolean, required: true, default: false },
    isPrivate: { type: Boolean, required: true, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
})

export default mongoose.model('Task', Task)