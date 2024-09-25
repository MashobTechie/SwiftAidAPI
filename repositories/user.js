const User = require("../models/usermodel");

const createNewUser = (values) => {
  return new User(values).save().then((user) => user.toObject());
};

const getUsers = () =>
  User.find({ active: true }).then((users) =>
    users.map((user) => user.toObject())
  );

// Corrected getUserById function
const getUserById = async (id) => {
  return await User.findById(id).select("+password"); // Ensure password is selected
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select("+password"); // Make sure password is selected
  console.log("Fetched User:", user); // Debugging line to check fetched user
  return user;
};

const getUserByFirstName = (firstName) =>
  User.findOne({ firstName }).then((user) => user?.toObject());

const getUserByLastName = (lastName) =>
  User.findOne({ lastName }).then((user) => user?.toObject());

const updateUserById = (id, values) =>
  User.findByIdAndUpdate(id, values, {
    new: true,
    runValidators: true,
    select: "-password -__v",
  }).then((user) => user?.toObject());

const deleteUser = (id) => User.findByIdAndDelete(id);

module.exports = {
  createNewUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByFirstName,
  getUserByLastName,
  updateUserById,
  deleteUser,
};
