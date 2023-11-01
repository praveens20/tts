const express = require('express');
const app = express();
const gtts = require('gtts');
const fs = require('fs');
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});


app.post('/downloadSpeech', (req, res) => {
  console.log(req.body);
  const { text, lang } = req.body;
  const outputFilePath = Date.now() + 'output.mp3';
  const speech = new gtts(text, lang);
  speech.save(outputFilePath, (err, result) => {
    if (err) {
      fs.unlinkSync(outputFilePath);
      res.send('Unable to convert to audio');
    }

    res.download(outputFilePath, (err, result) => {
      if (err) {
        fs.unlinkSync(outputFilePath);
        res.send('Unable to download the audio');
      }

      fs.unlinkSync(outputFilePath);
    })
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});