import request from "supertest"
import app from "../src/app.js"

describe ("Pantry API", ()=>{
    it ("GET/api/Pantry should return an array ", async ()=> {

    const res = await request ( app ) . get ("/api/pantry ") ;
    expect ( res.status ) . toBe (200) ;
    expect ( Array.isArray ( res . body ) ) . toBe (true) ;
    }) ;
    it (" POST/api/pantry should add a new item ", async ()=>{
        const res = await request ( app )
        .post ("/api/pantry ")
        .send ({ id: 1, quantity: 3 }) ;
        expect ( res . status ) . toBe (201) ;
        expect ( res . body ) . toHaveProperty ("id") ;
    }) ;
}) ;
