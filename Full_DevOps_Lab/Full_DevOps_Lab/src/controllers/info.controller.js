import { getAppInfoService } from "../services/info.service.js";

export const getInfo = (_req, res) => {
    const info = getAppInfoService();
    res.status(200).json(info);
};