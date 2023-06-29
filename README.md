# Web Project '***Society***' 🌐

#### About the project 🔍
This project consists of the development of a web page for the purchase of clothes. It is part of the work assigned in the Programming V course, within the Information Technology career. Some key considerations are the following:

- Module system used: **`ECMAScript Modules`** ‼️
- A database with MongoDB Atlas

### How to use this project❓
1. Clone the repository `git clone https://github.com/bragr05/Web-Society-Project.git`.
2. Install the project dependencies by executing the following command `npm install`.
3. Create an `.env` file in the root of the project directory based on the `.env.example file`.
4. Start the server with `npm start`.

#### Libraries 📚

- `Nodemon`: To avoid having to restart the server every time the server is changed.
- `Express`: This project uses the Node.js express library to handle HTTP requests and responses.
- `Dotenv`: For environment variables manipulation (_see the .env.example file to know which environment variables are needed_).
- `Mongoose`: To perform operations related to the MongoDB database.
- `Validator` : To perform validations on the data entered by the user.
- `express-session` : To use session variables.
- `bcrypt` : For user key encryption.
- `big.js` : For handling decimals in the latitude and longitude of the user's location.
- `Speakeasy` : To generate and verify two-factor authentication tokens based on the TOTP (Time-based One-Time Password) standard.
- `nodemailer` : In order to send the generated tokens and perform two-factor authentication.
