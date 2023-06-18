const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//@route  GET api/auth
//@desc
//@access public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//-------------------------------------------------------------

//@route  POST api/auth
//@desc   Authenicate user & get token
//@access public

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid Cresdentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "invalid Cresdentials" });
    }

    
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, "sai", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});
module.exports = router;
