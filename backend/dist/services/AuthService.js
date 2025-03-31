"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuthService {
    //register user
    static registerUser(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if user exist
            const existingUser = yield prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new Error("User already exists with this email!");
            }
            //hass password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            //creat user in DB
            const user = yield prisma.user.create({
                data: {
                    name, email, password: hashedPassword,
                }
            });
            return user;
        });
    }
    //login user
    static loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if user exists
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error("User not found!");
            }
            if (!user.password) {
                throw new Error("Password is empty");
            }
            //compare password
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                throw new Error("Invalid password!");
            }
            //create token
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error("JWT_SECRET is not defined in environment variables");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, { expiresIn: "7d" });
            return token;
        });
    }
}
exports.default = AuthService;
