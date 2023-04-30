import express from "express";
import tourRouter from "./routes/tourRoutes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({
		name: "hello",
	});
});

app.use("/api/v1/tours", tourRouter);

app.use('/', (_, res) => {
	res.send("<h1>Page Not Found</h1>")
})

export default app;
