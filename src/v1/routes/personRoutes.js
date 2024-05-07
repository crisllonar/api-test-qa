const express = require('express');
const personController = require("../../controllers/personController");

const router = express.Router();

router.get("/", personController.getAllPersons);

router.get("/:personId", personController.getPersonById);

router.post("/", personController.createNewPerson);

router.patch("/:personId", personController.patchPerson);

router.delete("/:personId", personController.deletePerson);

module.exports = router;