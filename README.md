PROJECT LAUNCH

Warning : To launch the project, make sure to add a env. file with the following informations:
MONGO_URI= "mongodb+srv://ICI:ICI@software-eng.qulphpl.mongodb.net/ICI?retryWrites=true&w=majority"
MONGO_USERNAME=""
MONGO_PASSWORD=""
MONGO_CLUSTER="software-eng.qulphpl"
MONGO_DBNAME=""
JWT_SECRET=""
PORT=3000
SALT_ROUNDS=

Make sure to put this file into :
Full_DevOps_Lab/Full_DevOps_Lab/src/

DATABASE
To regenerate the ingredients and recipes tables, go to :
Full_DevOps_Lab/Full_DevOps_Lab/src/

Then execute the node command seed/seed.js 

BACK END
Open a terminal and execute the following bash commands:
cd DevOps-Lab-Nodejs-Project/Full_DevOps_Lab/Full_DevOps_Lab
then :
nano .env
Add the right informations and save.
In the terminal, execute the following :
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm start

Server is properly launched once the following message is shown in your terminal: 
└─$ npm start

> devops-lab-student-project@1.0.0 start
> node src/index.js

[dotenv@17.2.3] injecting env (7) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
✅ SUCCESS: Connected to MongoDB via Mongoose: MealPlannerDB
API running at http ://localhost:3000

To confirm the proper launch of the server, when you access to http ://localhost:3000, you should be seeing:  
{"ok":true}

FRONT END
Open a second terminal (without closing the first one)
Run the following commands:
cd /DevOps-Lab-Nodejs-Project/Frontend_React
npm install
npm run #et non start car projet Vite
npm run dev

If everything goes well, you should be seeing:
  VITE v7.2.7  ready in 257 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help


Access to front end is via http://localhost:5173/
