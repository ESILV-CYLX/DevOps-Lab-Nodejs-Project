import * as authService from "../services/auth.service.js";

export const signup = async (req, res) => {
    try {
        const result = await authService.signup(req.body);
        return res.status(201).json(result);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
};

export const logout = (req, res) => {
    //TODO implement token invalidation or session destruction
    return res.json({ message: "Logout successful" });
};
