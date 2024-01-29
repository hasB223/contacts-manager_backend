const Contact = require("../models/contactModels");
const asyncHandler = require("express-async-handler");

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  private
const getContacts = asyncHandler(async (req, res, next) => {
  try {
    // Find all contacts belonging to current user and sort by timestamp
    const contacts = await Contact.find({ User: req.user.id }).sort({
      timestamp: -1,
    });

    // return contacts as JSON
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
});

// @desc    Get a contact by ID
// @route   GET /api/contacts/:id
// @access  private
const getContact = asyncHandler(async (req, res, next) => {
  try {
    // Find contact by ID and check if it exists and belongs to the user
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    } else if (contact.User.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }
    // return contact as JSON
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    // if ObjectId is invalid, throw error
    if (err.kind === "ObjectId") {
      res.status(404);
      throw new Error("Contact not found");
    }
    return next(err);
  }
});

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  private
const createContact = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    // If any value is missing, return an error and pass it to the error handler middleware
    if (!name || !email || !phone) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    // Create new contact with user id and contact information
    const newContact = new Contact({
      User: req.user.id,
      name,
      email,
      phone,
    });

    // save new contact to database
    const contact = await newContact.save();

    // return new contact as JSON
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
});

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  private
const updateContact = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    // If any value is missing, return an error and pass it to the error handler middleware
    if (!name || !email || !phone) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    // Find contact by ID and check if it exists and belongs to the user
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    if (contact.User.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    // update contact information
    contact.User = req.user.id;
    contact.name = name;
    contact.email = email;
    contact.phone = phone;

    // save updated contact to database
    const updatedContact = await contact.save();

    // return status, message, and updated contact as JSON
    res.json({ status: "Success", message: "Contact updated", updatedContact });
  } catch (err) {
    console.error(err.message);
    // if ObjectId is invalid, throw error
    if (err.kind === "ObjectId") {
      res.status(404);
      throw new Error("Contact not found");
    }
    return next(err);
  }
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  private
const deleteContact = asyncHandler(async (req, res, next) => {
  try {
    // Find contact by ID and check if it exists and belongs to the user
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    if (contact.User.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Not authorized");
    }

    // delete the contact from database
    await contact.deleteOne();

    // return status, message if deletion succeeded
    res.json({ status: "Success", message: "Contact removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      res.status(404);
      throw new Error("Contact not found");
    }
    return next(err);
  }
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
