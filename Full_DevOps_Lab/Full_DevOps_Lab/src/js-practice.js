// 2.1. Variables and Data Types
let hospitalName = "Central Hospital";
let nbrDoctors = 12;
let open = true;

if (open) {
    console.log("Welcome to " + hospitalName + "! We have " + nbrDoctors + " doctors currently available.");
}
else {
    console.log("Sorry, we are closed now.");
}

//2.2. Working with Arrays and Loops
let doctors = ["Lee", "Khan","Smith","Patel","Garcia"];

function listDoctors(docArray) {
    let string = "";
    for (let i=0; i < doctors.length; i++) {
        string += "Doctor #" + (i+1) +": Dr. " + doctors[i] +"\n";
    }
    return string;
}

console.log(listDoctors(doctors));
doctors.push("Johnson");
console.log(listDoctors(doctors));

function findDoctor(docArray, name) {
    if(docArray.includes(name)) {
        return "Doctor found";
    } else {
        return "Doctor not found";
    }
}

console.log("\nDoes Dr. Smith work here ? " + findDoctor(doctors, "Smith"));
console.log("Does Dr. Brown work here ? " + findDoctor(doctors, "Brown"));

//2.3. Objects and Nested Data
const patient = {
    name: "Alice Martin",
    age: 34,
    conditions: ["diabetes", "hypertension"],
    doctor: { name : "Dr. Lee", specialty: "Cardiology"}
};

console.log("Patient's doctor:", patient.doctor.name);
console.log("Patient's nbr of conditions:", patient.conditions.length);
console.log(patient.name + " is treated by " + patient.doctor.name + " (" + patient.doctor.specialty + ").");

patient.conditions.push("anxiety");