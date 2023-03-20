const mongoose = require('mongoose')

const productSchema=mongoose.Schema({
            name: {
                type: String,
                require:[true,'Please enter a product name']
            },
            quantity:{
                type:Number,
                required: true,
                default: 0
            },
            price: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: false
            }
        },
        {
            timestamps: true //create 2 fields (createdAT and updated AT)
        }
        )

const Product=mongoose.model('Product', productSchema)

module.exports = Product