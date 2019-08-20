const express = require("express");
const bodyParser = require("body-parser");

const aws = require("aws-sdk");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add your AWS credentials here
aws.config.update({
  accessKeyId: "AKIAIHZMKGHINTYLXHNA",
  secretAccessKey: "k+IncM2nJ9aMUg++DaNmnm+CM9ZgqfKVgRsxx7Qg",
  region: "us-east-1"
});

// Load AWS SES
const ses = new aws.SES({ apiVersion: "2010-12-01" });
// Add your email address here
const to = ["ericc2@andrew.cmu.edu"];
// Also add your email address as the sender
// Must belong to a verified SES account
const from = "ericc2@andrew.cmu.edu";

app.post("/api/contact/subscribe", function(req, res) {
  ses.sendEmail(
    {
      Source: from,
      Destination: { ToAddresses: to },
      Message: {
        Subject: {
          Data: `Contact form submission`
        },
        Body: {
          Text: {
            Data: `
                Name: ${req.body.name}
                Email: ${req.body.email}
                Message: ${req.body.message}
              `
          }
        }
      }
    },
    (err, data) => {
      if (err) {
        res.send({ status: "error" });
      } else {
        res.send({ status: "success" });
      }
    }
  );
});

app.listen(8080, function() {
  console.log("Server listening on port 8080");
});
