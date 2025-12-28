const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/profiles", require("./routes/profileRoutes"));
app.use("/api/programs", require("./routes/programRoutes"));
app.use("/api/workouts", require("./routes/workoutRoutes"));
app.use("/api/meals", require("./routes/mealRoutes"));
app.use("/api/weights", require("./routes/weightRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
