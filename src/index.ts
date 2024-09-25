import express from 'express';
import userRoutes from './handlers/user.handler';

const app = express();
import bodyParser from 'body-parser'; 

app.use(express.json());



app.get("/", (req, res) => {
  res.status(200).send("VOYAGE Server is running.....");
});

userRoutes(app);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
