const express = require('express')

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}= require('../controllers/userController')

const {
    
    getUserByIdValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator
} = require('../utils/validators/userValidator')

const router = express.Router()

router.route('/').get(getAllUsers)
                 .post(createUserValidator, createUser)
router.route('/:id').get(getUserByIdValidator, getUserById)
                    .put(updateUserValidator, updateUser)
                    .delete(deleteUserValidator, deleteUser)

module.exports = router