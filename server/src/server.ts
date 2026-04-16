import 'dotenv/config';
import app from "./app";
import { connectToMongoDB } from './config/mongo';

const PORT = process.env.PORT || 3000;

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
})