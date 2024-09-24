const UserModel = require("../models/usermodel");

const createNewUser = (values) => {
  return new UserModel(values).save().then((user) => user.toObject());
};

const getUsers = () =>
  UserModel.find({ active: true }).then((users) =>
    users.map((user) => user.toObject())
  );
// Example getUserById function
const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    throw err;
  }
};

const getUserByEmail = (email) => UserModel.findOne({ email });

const getUserByFirstName = (firstName) =>
  UserModel.findOne({ firstName }).then((user) => user?.toObject());

const getUserByLastName = (lastName) =>
  UserModel.findOne({ lastName }).then((user) => user?.toObject());

const updateUserById = (id, values) =>
  UserModel.findByIdAndUpdate(id, values, {
    new: true,
    runValidators: true,
    select: "-password -__v",
  }).then((user) => user?.toObject());

const deleteUser = (id) => UserModel.findByIdAndDelete(id);

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
