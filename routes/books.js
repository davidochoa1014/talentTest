const router = require("express").Router();
const c = require("../controllers/bookController");
const auth = require("../middleware/auth");

router.get("/", auth, c.getAll);
router.post("/", auth, c.create);
router.put("/:id", auth, c.update);
router.delete("/:id", auth, c.remove);
router.patch("/:id/toggle", auth, c.toggle);
router.get("/search", auth, c.search);

module.exports = router;