import express from 'express';
const app = express();
import cors from 'cors';
app.use(cors());

import diagnosesRouter from './routes/diagnoses';
import patientRouter from './routes/patients'

app.get('/ping', (_req, res) => {
    console.log('something pinged here');
    res.send('pong');
});

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientRouter);

const PORT = 3001;

app.listen(PORT, () => {
    console.log('app is running in port ', PORT);
});