const mongoose = require('mongoose')

const clientSchema=mongoose.Schema({
            name: {
                type: String,
                trim: true,
                required: [true,'Please enter your name'],
                minlength: [3, 'too short client name'],
                maxlength: [32 , 'too long client name']
            },
            // slug: A and B => a-and-b  
            slug: {
                type: String,
                lowercase: true
            },
            email:{
                type: String,
                trim: true,
                required: [true,'Please enter your email'],
                unique: [true, 'email must be unique']
            },
            phone: {
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

const Client = mongoose.model('Client', clientSchema)

module.exports = Client