const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors')

const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

// asn-10-flavour-burst 
// 7eQO8bYhuW8Zuj9a


// database

const uri = "mongodb+srv://asn-10-flavour-burst:7eQO8bYhuW8Zuj9a@cluster0.bbvd3eh.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect();

        const database = client.db('allBrandProducts');
        const productCollection = database.collection('products')

        // sepecific brnad products get data
        app.get('/products/:brand', async (req, res) => {
            const brand = req.params.brand.toLowerCase();
            const cursor = productCollection.find()
            const result = await cursor.toArray();
            // console.log(brand, 'aaaaa');

            const brandsProduct = result.filter(product => product.brandName.replace(/\s+/g, '-').toLowerCase() == brand)
            res.send(brandsProduct)
        })

        // signle product
        app.get('/products/:brand/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);

            res.send(result)
        })

        // insert 
        app.post('/products', async (req, res) => {
            const product = req.body;
            // console.log(products);
            const result = await productCollection.insertOne(product)
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

