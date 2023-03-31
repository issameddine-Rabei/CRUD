const express = require('express')
const {
    getClientByIdValidator,
    createClientValidator,
    updateClientValidator,
    deleteClientValidator,
} = require('../utils/validators/clientValidator')

const {
    getAllClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient,
} = require('../controllers/clientController')

const router = express.Router()

router.route('/').get(getAllClients)
                 .post(createClientValidator, createClient)
router.route('/:id').get(getClientByIdValidator, getClientById)
                    .put(updateClientValidator, updateClient)
                    .delete(deleteClientValidator, deleteClient)

module.exports = router;