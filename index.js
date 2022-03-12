const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://wecare2:uuHhnSv6Lv1YQHGd@cluster0.sovrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// all api
async function run() {
  try {
    await client.connect();

    const database = client.db("Wecare-2");
    const collection = database.collection("Clinic");

    // clinic information post api
    app.post("/clinic", async (req, res) => {
      //   convart image inti base64
      const imageFile = req.files.image.data;
      const encodedImage = imageFile.toString("base64");
      const bufferImage = Buffer.from(encodedImage, "base64");
      // convart gallery image in base64
      const galleryImageFile = req.files.gallery_image.data;
      const encodedgalleryImageFile = galleryImageFile.toString("base64");
      const bufferGalleryImage = Buffer.from(encodedgalleryImageFile, "base64");
      const clinicInformation = {
        image: bufferImage,
        gallery_image: bufferGalleryImage,
        name: req.body.clinic_name,
        address: req.body.address,
        address2: req.body.address2,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
        landline: req.body.landline,
        landline2: req.body.landline2,
        email: req.body.email,
      };
      const result = await collection.insertOne(clinicInformation);
      res.send(result);
    });

    // clinic information get api
    app.get("/clinicinfo", async (req, res) => {
      const result = await collection.find({}).toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// chacking
app.get("/", (req, res) => {
  res.send("wecare new server running");
});

app.listen(port, () => {
  console.log(`wecare new server is running in port`, port);
});
