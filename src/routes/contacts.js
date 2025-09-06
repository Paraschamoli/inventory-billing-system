import express from "express";
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
} from "../controllers/contactController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(verifyJWT, getContacts)
  .post(verifyJWT, createContact);

router.route("/:id")
  .get(verifyJWT, getContact)
  .put(verifyJWT, updateContact)
  .delete(verifyJWT, deleteContact);

export default router;
