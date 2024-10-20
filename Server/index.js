import connectDB from "./db/index.js";
import "dotenv/config";
import app from "./server.js";

connectDB()
  .then((res) => {
    console.log("Database connected Successfully");
    console.log("Database host: ", res.connection.host);
    console.log("Database name: ", res.connection.name);

    const PORT = process.env.PORT || 6000;
    app.listen(PORT, () => {
      console.log("Server listing on port:", PORT);
    });
  })
  .catch((err) => {
    console.log("error:", err);
    process.exit(1);
  });
