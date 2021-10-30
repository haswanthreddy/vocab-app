const express = require("express"); // frameword for node js for writing api's
const path = require("path");
const mongoose = require("mongoose"); // mongoose for connecting to DB
const cors = require("cors"); // makes interacting with front to back-end work , cors helps api calls possible between different domains
const oxford = require("oxford-dictionaries-api"); // oxford package

const VocabDBSchema = require(path.join(__dirname, "./DB/index.js")); // importing vocabshema that we created eralier, through which we perform operations
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

/* creating an instance of express, and writing middle ware function with "use"
 method so that  express.json() will recongnise request as a JSON object and parses it.
 And cors() enables api to accesible to other domains
 */

const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3000, () => {
  console.info(`server running at ${process.env.PORT}`);
});

// connecting to mongoose with the url obtained from mongoDB atlas since it is sensitive cant be shared has be stored in .env file (environment variables)

mongoose
  .connect(process.env.URL)
  .then(() => console.log("DB connection successfull"))
  .catch((err) => {
    console.log(err);
  });

// creating an instance of oxfor Api which passing APP_ID ,APP_KEY, as PARAMETERS

const oxfordDictionaries = new oxford(process.env.APP_ID, process.env.APP_KEY);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

/*     
the app.<method> , the http methods GET POST , when the method and the url path matches particular api is called 
here in the first api if the method is get and the path = "/" so if we get a request to that the api is called.
the api here in this case is added with keyword " async " , because since it is fetching from db we are blocking until that happens , 
or making that line synchronous with " awiat " keyword infront of the asynchronous task  

*/

// get all or search  , search is obtained from query parameters , which can be destructed from request object. and fetching from db sending it as response

app.get("/", async (req, res) => {
  try {
    let search = req.query.search;
    if (search === undefined) {
      search = "";
    }
    search = ".*" + search.toLowerCase();
    +".*"; // by this pattern '.*    *.' it checks  if string contains required term  (search)
    const data = await VocabDBSchema.find({ word: { $regex: search } }); // $regex makes search possible by pattern matching string
    res.json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get specific word through path parameters in request url

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await VocabDBSchema.findById(id);
    res.json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json(err);
  }
});

// add word , access word in Body  from request. Fetch the data for the corresponding word with oxford dictionary api and store in DB

app.post("/", async (req, res) => {
  try {
    console.log("1");
    const { word } = req.body;
    const checkForWord = await VocabDBSchema.findOne({ word: word });
    if (checkForWord === null) {
      const response = await oxfordDictionaries.entries({ word_id: word });

      const newData = new VocabDBSchema({
        word: response.id,
        vocab_data: response.results,
      });

      const savedWord = await newData.save();

      res.status(201).json({
        status: "success",
        data: savedWord,
      });
    } else {
      res.status(500).json({ err: "word already exists in database" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
