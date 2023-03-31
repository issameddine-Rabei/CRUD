const { check } = require('express-validator')
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

// Finds the validation errors in this request and wraps them in an object with handy functions

exports.getUserByIdValidator = [
    check('id').isMongoId().withMessage('invalid user ID format'),
    validatorMiddleware
]

exports.createUserValidator = [
    check("name")
        .notEmpty().withMessage('user name required')
        .isLength({ min: 3}).withMessage('Too short user name')
        .isLength({max: 32}).withMessage('Too long user name'),
    validatorMiddleware    
]

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('invalid user ID format'),
    validatorMiddleware
]

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('invalid user ID format'),
    validatorMiddleware
]