import express from "express";

// NOTE controller
import {
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
} from "../controller/tourController";

const router = express.Router();

// NOTE: query guard
router.param("id", (req, res, next, val) => {
	console.log(`the id is : ${val}`);
	next();
});


// prettier-ignore
router
	.route("/")
	.get(getAllTours)
	.post(createTour);

// prettier-ignore
router
	.route("/:id")
	.get(getTour)
	.patch(updateTour)
  .delete(deleteTour);

router.use("/:id", (req, res) => {
	res.status(405).send('<h1>Method Not Allowed</h1>')
})

export default router;
