import express from "express";
import { describe } from "node:test";


const router = express.Router();
//faut voir si je remplace pas id pas une variable ingredient directement
let pantry = [{id: 1, quantity:1}];
//get
router.get("/",(req,res)=>res.json(pantry));
//post
router.post("/",(req,res)=>{
    const{ nid , nquantity} = req.body;
    if (!nid || !nquantity)
        return res.status(400).json({error: "Données incomplètes"});
    if (nquantity<=0)
        return res.status(500).json({error: "Quantité prohibée"});
    let AlreadyinList = false;
    let indice = -1;
    for (let i=0; i < pantry.length; i++)
        if (pantry[i].id == nid)
            AlreadyinList = true;
            indice = i;
            
    if (AlreadyinList)
        pantry[indice]+=nquantity;
    else {   
        let newIngr = {id:nid, quantity: nquantity};
        pantry.push(newIngr);
    }
    return res.status(201).json(alreadyInList ? pantry[indice] : pantry[pantry.length - 1]);
});

router.delete("/",(req,res)=>{
    const{ nid} = req.body;
    if (!nid)
        return res.status(400).json({error: "Données incomplètes"});
    let isinList = false;
    let indice =-1; 
    for (let i=0; i < pantry.lentgh; i++)
        if (pantry[i].id == nid)
            isinList = true;
            indice = i;
    if(isinList){
        pantry.splice(indice,1);
        return res.status(200).json({message: "Ingrédient supprimé"});
    }
    else{
        return res.status(404).json({error: "Ingrédient n'est pas dans la liste"});
    }
});

export default router