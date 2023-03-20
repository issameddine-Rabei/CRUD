const express = require('express')
const app=express()
const mongoose = require('mongoose')
const Product = require('./models/productModel')


app.use(express.json())

app.get('/products', async(req, res) => {
    try{
        const products = await Product.find({})
        res.status(200).json(products)
    }catch(error){
        res.status(500).json({message: message.error})
    }
})

app.get('/products/:id', async(req, res) => {
    try{
        const {id}= req.params
        const products = await Product.findById(id)
        res.status(200).json(products)
    }catch(error){
        res.status(500).json({message: message.error})
    }
})

app.get('/', (req, res)=> {
    res.send('Hello ')
})

app.post('/products',async(req, res) => {
    try{
        const product = await Product.create(req.body)
        res.status(200).json(product)

    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

app.put('/products/:id', async(req, res) => {
    try {
        const {id} = req.params
        const product = await Product.findByIdAndUpdate(id , req.body)
        if (!product) {
            return res.status(404).json({message: `cannot find any product with the same id ${id}`})
        }  
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({message: message.error})
    }
})

app.delete('/products/:id', async(req, res) => {
    try {
        const {id} = req.params
        const product = await Product.findByIdAndDelete(id)
        if(!product) {
            return res.status(404).json({message:`cannot find any product with the same id ${id}`})
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: message.error})
    }
})

mongoose.connect('mongodb+srv://issame:issame97@cluster0.jkaiqd2.mongodb.net/node-API?retryWrites=true&w=majority')
.then(() => {
    console.log('connected to mongoDB')
    app.listen(3000, ()=> {
        console.log('APP RUNNING ON PORT 3000')
    })
}).catch((error) => {
    console.log(error)
})