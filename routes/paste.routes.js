const express = require("express");
const router = express.Router();

const pasteController = require("../controllers/paste.controller");

router.get("/health", pasteController.health);

router.post("/paste", pasteController.createPaste);
router.get("/paste/:id", pasteController.fetchPaste);
router.get("/p/:id", pasteController.viewPaste);

module.exports = router;
