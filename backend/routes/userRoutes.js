const express = require("express");
const User = require("../models/User");
const Role = require("../models/Roles");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");

const db = require('../db');

const router = express.Router();


router.post('/signup', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      roleType = "customer",
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    console.log(existingUser); // this is printing null ✅

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });

    console.log("✅ User created:", user?.userId);

    // Create the role (add try/catch block for visibility)
    try {
      const role = await Role.create({
        userId: user.userId,
        roleType,
      });
      console.log("✅ Role created:", role.roleType);
    } catch (roleErr) {
      console.error("❌ Error creating role:", roleErr);
      return res.status(500).json({ message: "Failed to assign role", error: roleErr.message });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: roleType,
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username,password,"testing");
    // ✅ Find user and include their role
    const user = await User.findOne({
      where: { username },
      include: [{
        model: Role,
        attributes: ["roleType"],
      }],
    });

    // ❌ Invalid credentials
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.userId, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return full user profile with address
    res.json({
      token,
      user: {
        id: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        role: user.Role?.roleType || "customer",

        // 🏡 Include address fields
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        country: user.country,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Protected Route: Get logged-in user's profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }, // don't return password
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});



router.put("/address/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country
    } = req.body;

    // 🔍 Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update address fields
    user.addressLine1 = addressLine1 || user.addressLine1;
    user.addressLine2 = addressLine2 || user.addressLine2;
    user.city = city || user.city;
    user.state = state || user.state;
    user.postalCode = postalCode || user.postalCode;
    user.country = country || user.country;

    await user.save();

    res.json({ message: "✅ Address updated successfully", address: {
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      country: user.country
    }});
  } catch (err) {
    console.error("❌ Error updating address:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Get All Users (Admin Only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Check if current user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // Fetch all users except their password
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/create-admin", async (req, res) => {

  try {
    const existing = await User.findOne({ where: { email: "admin@example.com" } });
    if (existing) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      password: "admin",
      roleType: "admin",
      isAdmin: true, // 👈 Make this user an admin
    });

    res.status(201).json({
      message: "✅ Admin user created",
      admin: {
        username: adminUser.username,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Failed to create admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Dummy route to delete admin user by email
router.get("/remove-admin", async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { email: "admin@example.com" }, // or username: 'admin'
    });

    if (deleted) {
      return res.json({ message: "✅ Admin user deleted successfully." });
    } else {
      return res.status(404).json({ message: "❌ Admin user not found." });
    }
  } catch (error) {
    console.error("❌ Error deleting admin user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// ✅ Update a User by ID (Only Admin or the User)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Find user by primary key (ID)
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure the current user is either the account owner or an admin
    if (req.user.id !== user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to update user' });
    }

    // ✅ Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    // Optional: remove password before sending back
    const userData = user.toJSON();
    delete userData.password;

    res.json({ message: 'User updated successfully', user: userData });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a User by ID (Only Admin or the User)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Find the user by primary key
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure the user is either the account owner or an admin
    if (req.user.id !== user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to delete user' });
    }

    // Delete the user
    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
