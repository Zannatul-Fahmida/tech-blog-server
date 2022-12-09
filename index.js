require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9pclo.mongodb.net/test`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("techblog");
    const blogCollection = db.collection("blogs");

    // get all blogs
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();

      res.send({ status: true, data: blog });
    });

    // get single blog
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      res.send({ status: true, data: blog });
    });

    // post new blog
    app.post("/blog", async (req, res) => {
      const blog = req.body;

      const result = await blogCollection.insertOne(blog);

      res.send(result);
    });

    // update a blog
    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBlog = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updatedBlog.title,
          description: updatedBlog.description,
          tag: updatedBlog.tag,
          date: updatedBlog.date,
        },
      };
      const result = await blogCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // delete a blog
    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;

      const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
