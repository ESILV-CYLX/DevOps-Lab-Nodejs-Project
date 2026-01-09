import bcrypt from "bcrypt";
import User from "../models/User.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;


export const getAllUsers = async () => {
    return await User.find().select("-password");
};

export const getUserById = async (_id) => {
    const id = parseInt(_id);
    const user = await User.findOne({ userId: id }).select("-password");

    if (!user) throw { status: 404, message: "User not found" };

    return user;
};

export const updateUser = async (_id, requesterId, data) => {
    const id = parseInt(_id);

    if (id !== requesterId) throw { status: 403, message: "Forbidden: cannot update another user" };

    const user = await User.findOne({ userId: id });
    if (!user) throw { status: 404, message: "User not found" };

    const updatedUser = await User.findOneAndUpdate(
        {userId: id},
        {$set: {
            username: data.username || user.username,
            email: data.email || user.email,
            dietaryPreferences: data.dietaryPreferences ?? user.dietaryPreferences,
            servingSize: data.servingSize ?? user.servingSize
        }
        },
        { new: true }
    ).select("-password");

    return updatedUser;
};

export const updatePassword = async (_id, requesterId, { oldPassword, newPassword }) => {
    const id = parseInt(_id);

    if (id !== requesterId) throw { status: 403, message: "Forbidden: cannot change password of another user" };
    if (!oldPassword || !newPassword) throw { status: 400, message: "Missing old or new password" };
    if (newPassword.length < 6) throw { status: 400, message: "New password too short (min 6 chars)" };

    const user = await User.findOne({ userId: id });
    if (!user) throw { status: 404, message: "User not found" };

    // Comparaison avec bcrypt
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw { status: 401, message: "Old password incorrect" };

    // Hachage du nouveau mot de passe et sauvegarde
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    return { message: "Password updated successfully" };
};