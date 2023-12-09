const express = require('express');
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors')

const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

// asn-10-flavour-burst 
// 7eQO8bYhuW8Zuj9a


// database

// const uri = "mongodb+srv://asn-10-flavour-burst:7eQO8bYhuW8Zuj9a@cluster0.bbvd3eh.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bbvd3eh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // database all products
        const database = client.db('allBrandProducts');
        const productCollection = database.collection('products')

        // database cart products
        const cartCollection = database.collection('cartItems')


        // sepecific brnad products get data
        app.get('/products/:brand', async (req, res) => {
            const brand = req.params.brand.toLowerCase();
            const cursor = productCollection.find()
            const result = await cursor.toArray();
            console.log(brand, 'aaaaa');

            const brandsProduct = result?.filter(product => product.brandName.replace(/\s+/g, '-').toLowerCase() == brand)
            res.send(brandsProduct)
        })

        // signle product
        app.get('/products/:brand/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);

            res.send(result)
        })

        // add product 
        app.post('/products', async (req, res) => {
            const product = req.body;
            // console.log(products);
            const result = await productCollection.insertOne(product)
            res.send(result)
        })

        // update product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body;

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updatedProduct = {
                $set: {
                    brandName: data.brandName,
                    image: data.image,
                    title: data.title,
                    price: data.price,
                    rating: data.rating,
                    details: data.details,
                    type: data.type,
                }
            }

            const result = await productCollection.updateOne(filter, updatedProduct, options);
            res.send(result)

        })


        // cart product
        app.post('/addCart', async (req, res) => {
            const product = req.body;
            // console.log('tt', product);
            const result = await cartCollection.insertOne(product)
            res.send(result);

        })
        // get cart product
        app.get('/addCart/:user', async (req, res) => {
            const userId = req.params.user
            const cursor = cartCollection.find()
            const result = await cursor.toArray()

            const userBasedItem = result?.filter(item => item.uid == userId)
            // console.log(userBasedItem);
            res.send(userBasedItem)

        })

        // delete to cart
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`The Flavour Burst server is running on port: ${port}`)
})


