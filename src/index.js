import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/videos", routes.video);

// app.use((req, res, next) => {
//   req.context = {
//     models,
//     me: models.users[1],
//   };
//   next();
// });

// app.use("/session", routes.session);
// app.use("/users", routes.user);
// app.use("/messages", routes.message);
