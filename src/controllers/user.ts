import { User } from '../entity/user';
import { getRepository } from 'typeorm';

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

export class UserController {
    static async signUp(req: any, res: any) {
        try {
            const {
                firstName, lastName, email, password
            } = req.body;

            const passwordHash = bcrypt.hashSync(password, 10);

            const user = await new User();
            user.password = passwordHash;
            user.firstName = firstName
            user.lastName = lastName
            user.email = email

            const results = await getRepository(User).save(user)

            // remove password hash from object before sending the object
            delete user.password

            return res.status(201).send(results)
        } catch (error) {
            return res.status(409).send({ message: "An account with similar email address exists" })
        }
    }

    static async login(req: any, res: any) {
        const { password, email } = req.body;

        const user = await getRepository(User).findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

            const { firstName, lastName } = user

            return res.status(200).send({ firstName, lastName, token });
        } else {
            return res.status(401).send({ message: "Wrong password or email!" });
        }
    }
}
