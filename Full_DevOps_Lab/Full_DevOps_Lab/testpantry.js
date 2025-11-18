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
    let indice;
    for (let i=0; i < length(pantry); i++)
        if (pantry[i].id == nid)
            AlreadyinList = true;
            indice = i;
    if (AlreadyinList)
        pantry[indice]+=nquantity;
    else {   
        let newIngr = {nid, nquantity};
        pantry.push(newIngr);
    }
});

router.delete("/",(req,res)=>{
    const{ nid} = req.body;
    if (!nid)
        return res.status(400).json({error: "Données incomplètes"});
    let isinList = false;
    let indice; 
    for (let i=0; i < length(pantry); i++)
        if (pantry[i].id == nid)
            isinList = true;
            indice = pantry.indexOf(value);
    if(isinList){
        pantry.splice(indice,1);
    }
    else{
        res.status(600).json({error: "Ingrédient n'est pas dans la liste"});
    }
});

export default router