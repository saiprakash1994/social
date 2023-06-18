const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route  GET api/profile/me
//@desc   GET Current users profile
//@access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//@route  POST api/profile/
//@desc   Create or upadate Profile
//@access Private

router.post("/", auth, async (req, res) => {
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  //build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }
  //build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;
  try {
    let profile = Profile.findOne({ user: req.user.id });
    if (!profile) {
      //update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }
    //create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server Error");
  }
});

//@route  GET api/profile/
//@desc   get all profiles
//@access public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    consol.error(error.message);
    res.status(500).send("server Error");
  }
});

//@route  GET api/profile/user/:user_id
//@desc   get profile by user id
//@access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ message: "profile not found" });
    }
    res.json(profile);
  } catch (error) {
    consol.error(error.message);
    res.status(500).send("server Error");
  }
});

//@route  Delete api/profile
//@desc   Delete profile,user & posts
//@access private

router.delete("/", auth, async (req, res) => {
  try {
    //revome profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ message: "user deleted" });
  } catch (error) {
    consol.error(error.message);
    res.status(500).send("server Error");
  }
});

//@route  PUT api/profile/experience
//@desc   ADD profile exprience
//@access private
router.put("/experience", auth, async (req, res) => {
  const { title, company, location, from, to, current, description } = req.body;
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server Error");
  }
});

//@route  DELETE api/profile/experience/:exp_id
//@desc   Delete experience from profile
//@access private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.exprience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server Error");
  }
});

//@route  PUT api/profile/education
//@desc   ADD profile education
//@access private
router.put("/education", auth, async (req, res) => {
  const { school, degree, fieldofstudy, from, to, current, description } =
    req.body;
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(newEdu);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server Error");
  }
});

//@route  DELETE api/profile/education/:edu_id
//@desc   Delete education from profile
//@access private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server Error");
  }
});

module.exports = router;
