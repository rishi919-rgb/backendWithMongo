const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect(
  'mongodb+srv://rishi919:rishi919@cluster0.6vfenvi.mongodb.net/Flipkart'
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true, minlength: 2 },
  city: { type: String, required: true },
  membership: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);


app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});


app.get('/users/:id', async (req, res) => {
  const userId = Number(req.params.id);

  const foundUser = await User.findOne({ _id: userId });

  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(foundUser);
});


app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});


app.post('/users/many', async (req, res) => {
  const users = await User.insertMany(req.body);
  res.json(users);
});


app.put('/users/:id', async (req, res) => {

  const userId = Number(req.params.id);

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.body.name) foundUser.name = req.body.name;
  if (req.body.city) foundUser.city = req.body.city;
  if (req.body.membership) foundUser.membership = req.body.membership;

  await foundUser.save();

  res.json(foundUser);
});


app.delete('/users/:id', async (req, res) => {

  const userId = Number(req.params.id);

  const foundUser = await User.findById(userId);

  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }

  await foundUser.deleteOne();

  res.json({ message: "User deleted successfully" });
});


app.patch('/users/:id', async (req, res) => {

  const userId = Number(req.params.id);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    req.body,
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(updatedUser);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});