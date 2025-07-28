import express from "express";
import { 
    getFriends,
    getSingleFriend,
    updateInterests,
    updateCatchphrases 
} from "../controllers/friendController.js";

const router = express.Router();

router.get("/", getFriends);
router.get("/:name", getSingleFriend);
router.patch("/:name/interests", updateInterests);
router.patch("/:name/catchphrases", updateCatchphrases);

export default router;