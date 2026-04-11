import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health-check', (req, res) => {
    res.json({
        message: 'Server is running!'
    });
});

export default app;