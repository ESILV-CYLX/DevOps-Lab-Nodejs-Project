import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getVersionService = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const pkg = JSON.parse(
        // fs.readFileSync(path.join(__dirname, "..", "..", "..", "package.json"), "utf-8")
        fs.readFileSync(path.join(__dirname, "../../../package.json"), "utf-8")
    );
    return pkg.version;
};