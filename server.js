
const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "library-project-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: false
    }
}));

const usersFile = path.join(__dirname, "users.json");

function getUsers() {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data);
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

const protectedPages = [
    "/home.html",
    "/project.html",
    "/contact.html"
];

app.use((req, res, next) => {
    if (protectedPages.includes(req.path) && !req.session.user) {
        return res.redirect("/index.html");
    }

    next();
});

app.use(express.static(__dirname));

// Register
app.post("/api/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!["Member", "Librarian"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const users = getUsers();

        const existingUser = users.find(
            user => user.email === normalizedEmail
        );

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email: normalizedEmail,
            password: hashedPassword,
            role: role
        };

        users.push(newUser);
        saveUsers(users);

        res.status(201).json({
            message: "Account created successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const users = getUsers();

        const user = users.find(
            user => user.email === normalizedEmail
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.role !== role) {
            return res.status(401).json({
                message: "Invalid role"
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        req.session.user = {
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            message: "Login successful",
            role: user.role
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Check session
app.get("/api/session", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Not logged in"
        });
    }

    res.json({
        user: req.session.user
    });
});

// Logout
app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            message: "Logged out successfully"
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
