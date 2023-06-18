const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const {check, validationResults} =require("express-validator/check")
// //@route  POST api/users
// //@desc   Register user
// //@access public
// router.post(
//   "/",
//   [
//     check("name is requried").not().isEmpty(),
//     check("email", "please include a valid name").isEmail(),
//     check("password", "please").isLength({ min: 6 }),
//   ],
//   (req, res) => {
//  const errors=validationResult(req);

//     console.log(req.body);
//     res.send("user route");
//   }
// );

//-------------------------------------------------------------

//@route  POST api/users
//@desc   Register user
//@access public
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    var avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

    user = new User({
      name,
      email,
      avatar,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, "sai", { expiresIn: 360000 }, (err,token) => {
      if(err) throw err;
      res.json({token})
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});
module.exports = router;
