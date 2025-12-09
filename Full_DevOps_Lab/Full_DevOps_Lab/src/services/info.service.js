import { getPackageInfo, getRuntimeInfo } from "../utils/appInfo.js";

/**
 * Combine toutes les informations utiles sur l'application.
 * - version & nom (package.json)
 * - runtime Node & uptime
 */
export const getAppInfoService = () => {
    const packageInfo = getPackageInfo();      // { name, version }
    const runtimeInfo = getRuntimeInfo();      // { node, uptime }
    
    return { ...packageInfo, ...runtimeInfo };
};