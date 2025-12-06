import bcrypt from "bcrypt";
import User from "../models/User.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;

let users = []; //remplacer par DB

export const getAllUsers = () => {
    return users.map(({ password, ...u }) => u);
};

export const getUserById = (_id) => {
    const id = parseInt(_id);
    const user = users.find(u => u.userId === id);

    if (!user) throw { status: 404, message: "User not found" };

    const { password, ...safe } = user;
    return safe;
};

export const updateUser = (_id, requesterId, data) => {
    const id = parseInt(_id);

    if (id !== requesterId) throw { status: 403, message: "Forbidden: cannot update another user" };

    const index = users.findIndex(u => u.userId === id);
    if (index === -1) throw { status: 404, message: "User not found" };

    const updated = new User(
        id,
        data.username || users[index].username,
        data.email || users[index].email,
        users[index].password,
        data.dietaryPreferences ?? users[index].dietaryPreferences,
        data.servingSize ?? users[index].servingSize
    );

    users[index] = updated;
    const { password, ...safe } = updated;
    return safe;
};

export const updatePassword = async (_id, requesterId, { oldPassword, newPassword }) => {
    const id = parseInt(_id);

    if (id !== requesterId) throw { status: 403, message: "Forbidden: cannot change password of another user" };
    if (!oldPassword || !newPassword) throw { status: 400, message: "Missing old or new password" };
    if (newPassword.length < 6) throw { status: 400, message: "New password too short (min 6 chars)" };

    const index = users.findIndex(u => u.userId === id);
    if (index === -1) throw { status: 404, message: "User not found" };

    const user = users[index];
    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) throw { status: 401, message: "Old password incorrect" };

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    return { message: "Password updated successfully" };
};

export { users };