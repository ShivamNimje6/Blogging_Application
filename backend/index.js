const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");
const createRoute = require("./routes/create");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");

//database

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database is connected successfully!");
  } catch (err) {
    console.log(err);
  }
};
//MIDDLEWARES
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
// app.use(cors({ origin: "*", credentials: true }));
//hellooooo
// / Updated CORS setup
const corsOptions = {
  origin: "https://blogapp3-5k6w31ue2-shivam-nimjes-projects.vercel.app ",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/create", createRoute);

app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

//image upload
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img);
    // fn(null, "image1.jpg");
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  // console.log(req.body);
  res.status(200).json("Image has been uploaded successfully!");
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("app is running on port 5000" + process.env.PORT);
});
