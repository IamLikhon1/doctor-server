const express = require('express');
const cors = require('cors');
const app=express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT||5000;

app.use(cors());
app.use(express.json());


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snwbd1q.mongodb.net/?retryWrites=true&w=majority`;

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

    const doctorCollection=client.db('doctorInfo').collection('info');
    const bookingCollection=client.db('doctorInfo').collection('bookInfo');

    app.get('/specialist',async(req,res)=>{
        const cursor=doctorCollection.find();
        const result=await cursor.toArray();
        res.send(result)

    });

    app.get('/specialist/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await doctorCollection.findOne(query);
        res.send(result)
    });


    app.get('/booking',async(req,res)=>{
      const result=await bookingCollection.find().toArray();
      res.send(result)
    })

    app.post('/booking',async(req,res)=>{
        const booking=req.body;
        const result=await bookingCollection.insertOne(booking);
        res.send(result);
    });

    

    app.put('/booking/:id',async(req,res)=>{
      const id=req.params.id;
      const updateDocBook=req.body
      const filter={_id:new ObjectId(id)};
      const options = { upsert: true };

      const book={
        $set:{
          name:updateDocBook.customerName,
          date:updateDocBook.date
        }
      }

      const result=await bookingCollection.updateOne(filter,book,options);
      res.send(result)

    })

    app.delete('/booking/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await bookingCollection.deleteOne(query);
      res.send(result)
    });
    app.get('/booking/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await bookingCollection.findOne(query);
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








app.get('/',(req,res)=>{
    res.send('Doctor server is running')
});
app.listen(port,()=>{
    console.log(`Doctor server is running on port:${port}`)
})



