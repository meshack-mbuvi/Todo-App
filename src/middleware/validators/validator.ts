import * as Joi from 'joi';

export default function joiValidate(source: any, schema: any) {
    return (req: any, res: any, next: any) => {
        const { error } = Joi.validate(req[source], schema,
            { abortEarly: false });
        if (error) {
            return res.status(400).json({
                data: { message: error.message },
            });
        }
        return next();
    };
}
