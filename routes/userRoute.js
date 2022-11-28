const express = require("express");
const { User, validateUser } = require("../dataModel/usersModel");
const bcrypt = require("bcrypt");
const sendMail = require("../NodeMailer/sendMail");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(404).send("No user found");
  }
  res.status(200).send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("user with given id not found");

  res.status(200).send(user);
});

router.post("/generateandsendotp", async (req, res) => {
  const otp = Math.floor(Math.random() * 1000000);
  const user = await User.findById(req.body.userId);

  const html = `
  <body>
  <div style="width: 100%; padding: 20px;">

      <p>
          Hello ${user.firstName + " " + user.lastName},

      </p>
      <p>
          Here is your OTP:${otp}<br/>
          please use this to reset your password account   
      </p>

      <p>Replay to this email with any queries,clarifications that we may help you with</p>
      

  </div>
</body>
  
  
  `;
  sendMail(user.email, "Forgot Password", html);
  res.status(200).send(`${otp}`);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(401).send("user is already registered");

  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    userName: req.body.userName,
    password: req.body.password,
    isActive: req.body.isActive,
    isAdmin: req.body.isAdmin,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();

  res.status(200).send(user);
});

router.patch("/:id", async (req, res) => {
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        password: encryptedPassword,
      },
    },
    { new: true }
  );

  if (!user) return res.status(400).send("Unbale to Patch...");
  return res.status(200).send(user);
});

module.exports = router;
