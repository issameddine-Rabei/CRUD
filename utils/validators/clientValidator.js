const { check } = require('express-validator')
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

// Finds the validation errors in this request and wraps them in an object with handy functions

exports.getClientByIdValidator = [
    check('id').isMongoId().withMessage('invalid client ID format'),
    validatorMiddleware
]

exports.createClientValidator = [
    check("name")
        .notEmpty().withMessage('Client name required')
        .isLength({ min: 3}).withMessage('Too short Client name')
        .isLength({max: 32}).withMessage('Too long Client name'),
    validatorMiddleware    
]

exports.updateClientValidator = [
    check('id').isMongoId().withMessage('invalid client ID format'),
    validatorMiddleware
]

exports.deleteClientValidator = [
    check('id').isMongoId().withMessage('invalid client ID format'),
    validatorMiddleware
]