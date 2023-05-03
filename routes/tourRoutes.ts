import express from "express";

// NOTE controller
import {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	aliasTopTours,
} from "../controller/tourController";

const router = express.Router();

// NOTE: query guard
router.param("id", (req, res, next, val) => {
	console.log(`the id is : ${val}`);
	next();
});

// NOTE run middleware as preprocess req query then pass to getAllTours to flter....etc
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

router.use("/:id", (req, res) => {
	res.status(405).send("<h1>Method Not Allowed</h1>");
});

export default router;
