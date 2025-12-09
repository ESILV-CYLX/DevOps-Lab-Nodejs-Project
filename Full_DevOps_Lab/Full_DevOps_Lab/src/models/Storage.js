import mongoose from "mongoose";

// Storage Schema for MongoDB
const storageSchema = new mongoose.Schema({
    storageId: { type: Number, required: true, unique: true},
    userId: { type: Number, required: true},
    type: { type: String, required: true}
});

//ESM export
const StorageModel = mongoose.model("Storage", storageSchema);
export default StorageModel;