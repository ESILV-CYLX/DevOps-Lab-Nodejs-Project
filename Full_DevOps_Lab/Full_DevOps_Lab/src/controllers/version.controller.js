import { getVersionService } from "../services/version.service.js";

export const getVersion = (req, res) => {
    res.status(200).json({ version: getVersionService() });
};