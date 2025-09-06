import Contact from "../models/Contact.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getContacts = asyncHandler(async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { businessId: req.user._id };

    if (type) {
      query.type = type;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const contacts = await Contact.find(query);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getContact = asyncHandler(async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      businessId: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const createContact = asyncHandler(async (req, res) => {
  try {
    const { name, phone, email, address, type } = req.body;

    const contact = new Contact({
      name,
      phone,
      email,
      address,
      type,
      businessId: req.user._id,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateContact = asyncHandler(async (req, res) => {
  try {
    const { name, phone, email, address, type } = req.body;

    const contact = await Contact.findOne({
      _id: req.params.id,
      businessId: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.name = name || contact.name;
    contact.phone = phone || contact.phone;
    contact.email = email || contact.email;
    contact.address = address || contact.address;
    contact.type = type || contact.type;

    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteContact = asyncHandler(async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      businessId: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.json({ message: "Contact removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { getContacts, getContact, createContact, updateContact, deleteContact };
