const { Author, validateAuthor } = require("../models/index");

const addAuthor = async function (req, res) {
  try {
    // Validate the incoming data with Joi
    const { error } = validateAuthor(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message); // If validation fails, send error
    }

    // If validation passes, create the author in the database
    const author = new Author(req.body);
    await author.save();
    res.send(author);
  } catch (err) {
    res.send(err);
  }
};
const getAuthors = async function (req, res) {
  try {
    const authors = await Author.find().populate("posts");
    res.send(authors);
  } catch (err) {
    res.send(err);
  }
};

const updateAuthor = async function (req, res) {
  try {
    // Validate the incoming data with Joi
    const { error } = validateAuthor(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message); // If validation fails, send error
    }

    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(author);
  } catch (err) {
    res.send(err);
  }
};

const deleteAuthor = async function (req, res) {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    res.send({ message: `Author ${author.name} has been deleted!` });
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  addAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
};
