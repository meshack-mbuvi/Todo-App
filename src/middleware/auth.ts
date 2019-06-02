const jwt = require("jsonwebtoken");

export const authentication = (req: any, res: any, next: any) => {
    const url = req.originalUrl
    if (url === '/api/users/login' || url === '/api/users/signup') {
        return next();
    }

    const secretKey = process.env.SECRET_KEY;
    const token =
        req.body.token || req.query.token || req.headers.authorization;

    if (token && token.split(' ')[0] === 'Bearer') {
        jwt.verify(token.split(' ')[1], secretKey,
            (error: any, user: any) => {
                if (error) {
                    return res.status(401).send(error);
                } else {
                    req['user'] = user;
                    return next();
                }
            });
    } else {
        return res
            .status(401)
            .send({ message: 'Missing authorization bearer token' });
    }
};
