const { MongoClient } = require("mongodb");
const client = new MongoClient(DB);
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    const database = client.db("trying_mongoose");
    const users = database.collection("users");

    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
