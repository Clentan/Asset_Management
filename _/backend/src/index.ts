import express from "express";
import router from "./routes/routes";
import cors from "cors";
import StartCronJobs from "./utils/scheduler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
}));

StartCronJobs();

app.listen(8080, () => {
    console.log("Server connected and running on port 8080");
    app.use(router);
});