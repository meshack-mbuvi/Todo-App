import * as Joi from '@hapi/joi';

const onError = (error: any) => {

    const [errorObject] = error;
    const { type, context: { key, limit } } = errorObject

    switch (type) {
        case 'any.required': {
            return new Error(`${key} is required`);
        }
        case 'string.min': {
            return new Error(
                `${key} must be at least ${limit} characters long.`);
        }
        case 'string.email': {
            return new Error(`${key} must be a valid email address`);
        }
        case 'boolean.base': {
            return new Error(`${key} must be a boolean value`);
        }
        default: {
            return new Error(`${key} should not be empty.`);
        }
    }
};

export const userSignUpRequestSchema = Joi.object().keys({
    firstName: Joi
        .string().trim().not("")
        .required()
        .error((err) => onError(err)),
    lastName: Joi
        .string().trim().not("")
        .required()
        .error((err) => onError(err)),
    email: Joi
        .string().trim().not("")
        .email()
        .required()
        .error((err) => onError(err)),
    password: Joi
        .string().trim().not("")
        .min(6)
        .required()
        .error((err) => onError(err))
})

export const userLoginRequestSchema = Joi.object().keys({
    email: Joi
        .string().trim().not("")
        .email()
        .required()
        .error((err) => onError(err)),
    password: Joi
        .string().trim().not("")
        .required()
        .error((err) => onError(err))
})

export const projectRequestSchema = Joi.object().keys({
    title: Joi
        .string().trim().not("")
        .required()
        .error((err) => onError(err)),
    description: Joi
        .string().trim().not("")
        .error((err) => onError(err))
})

export const todoRequestSchema = Joi.object().keys({
    title: Joi
        .string().trim().not("")
        .required()
        .error((err) => onError(err)),
})

export const singleTodoRequestSchema = Joi.object().keys({
    projectId: Joi
        .number()
        .required()
        .error((err) => onError(err)),
    todoId: Joi
        .number()
        .required()
        .error((err) => onError(err)),
})

export const todoUpdateRequestSchema = Joi.object().keys({
    title: Joi
        .string().trim().not("")
        .error((err) => onError(err)),
    started: Joi
        .boolean().strict()
        .error(err => onError(err)),
    finished: Joi
        .boolean().strict()
        .error(err => onError(err))
})
