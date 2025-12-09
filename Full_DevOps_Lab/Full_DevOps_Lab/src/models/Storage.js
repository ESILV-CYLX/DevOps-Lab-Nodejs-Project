import mongoose from "mongoose";
import { StorageType } from "./enums/StorageType";

// Storage Schema for MongoDB
const storageSchema = new mongoose.Schema({
    storageId: { type: Number, required: true, unique: true},
    userId: { type: Number, required: true},
    type:  { 
        type: String, 
        enum: Object.values(StorageType), 
        required: true 
    },
});

//ESM export
const StorageModel = mongoose.model("Storage", storageSchema);
export default StorageModel;