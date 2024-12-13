import express from "express";
import jwt from "jsonwebtoken";
const app = express();

const SECRET_KEY = "This_is_very_Secured_key";

app.use(express.json());

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

const getUserData = (req, res) => {
	res.json(req.user);
};

const validateUser = (req, res, next) => {
	const token = req.headers["Authorization"];

	console.log(token);

	if (!token) {
		return res.status(403).send("Token is required");
	}
	try {
		const bearerToken = token.split(" ")[1];
		const decodedUser = jwt.verify(bearerToken, SECRET_KEY);
		req.user = decodedUser;
	} catch (err) {
		return res.status(401).send("Invalid Token");
	}
	next();
};

app.get("/", (req, res) => {
	const payload = { username: "test_user" };

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
	res.json({ token });
});
app.get("/user", validateUser, getUserData);
