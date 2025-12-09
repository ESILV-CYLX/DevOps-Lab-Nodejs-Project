import * as userService from "../services/users.service.js";

export const getAllUsers = (req, res) => {
    const users = userService.getAllUsers();
    return res.json(users);
};

export const getUserById = (req, res) => {
    try {
        const user = userService.getUserById(req.params.id);
        return res.json(user);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
};

export const updateUser = (req, res) => {
    try {
        const updatedUser = userService.updateUser(req.params.id, req.userId, req.body);
        return res.json(updatedUser);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const result = await userService.updatePassword(req.params.id, req.userId, req.body);
        return res.json(result);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
};