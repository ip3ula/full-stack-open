import express from "express";
const router = express.Router();
import { getEntries } from "../services/patientService";

router.get('/', (_req, res) => {
    res.send(getEntries());
});

export default router;