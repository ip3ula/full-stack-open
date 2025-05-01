import express from 'express';
const router = express.Router();
import { getEntries } from '../services/diagnosesService';

router.get('/', (_req, res) => {
    res.send(getEntries());
});

export default router;