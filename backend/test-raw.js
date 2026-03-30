const { MongoClient } = require('mongodb');

const uri = "mongodb://LsfiCyXvG6P3Vv7G:Rrravindra11@atlas-sql-69c5134e12156ad335348c9f-kc4agy.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Successfully connected to Atlas SQL / Federation endpoint!");
    const db = client.db("sample_mflix");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
  } finally {
    await client.close();
  }
}
run();
