import { getPantry, addToPantry, deleteFromPantry } from "../services/pantry.service.js";

export function getPantryController(req, res) {
    return res.json(getPantry());
}

export function addPantryController(req, res) {
    const { nid, nquantity } = req.body;

    if (!nid || !nquantity)
        return res.status(400).json({ error: "Données incomplètes" });

    try {
        const result = addToPantry(nid, nquantity);
        return res.status(201).json(result);
    } catch (err) {
        if (err.message === "INVALID_QUANTITY")
            return res.status(400).json({ error: "Quantité prohibée" });

        return res.status(500).json({ error: "Erreur interne" });
    }
}

export function deletePantryController(req, res) {
    const { nid } = req.body;

    if (!nid)
        return res.status(400).json({ error: "Données incomplètes" });

    try {
        deleteFromPantry(nid);
        return res.json({ message: "Ingrédient supprimé" });
    } catch (err) {
        if (err.message === "NOT_FOUND")
            return res.status(404).json({ error: "Ingrédient introuvable" });

        return res.status(500).json({ error: "Erreur interne" });
    }
}
