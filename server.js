const express = require("express");
const app = express();
const { resolve } = require("path");
const port = process.env.PORT || 3000;

// Importing the dotenv module to use environment variables:
require("dotenv").config();

// Get the Stripe API key from the environment variables
const api_key = process.env.SECRET_KEY;

// Check if the API key exists before initializing Stripe
let stripe;
if (api_key) {
  stripe = require("stripe")(api_key);
  console.log("Stripe initialized with API key.");
} else {
  console.log("Warning: No Stripe API key provided. Stripe-related functionality will be disabled.");
}

// Setting up the static folder:
app.use(express.static(resolve(__dirname, process.env.STATIC_DIR || "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html" || "public/index.html");
  res.sendFile(path);
});

// Creating a route for the success page:
app.get("/success", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/success.html" || "public/success.html");
  res.sendFile(path);
});

// Creating a route for the cancel page:
app.get("/cancel", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/cancel.html" || "public/cancel.html");
  res.sendFile(path);
});

// Workshop page routes:
app.get("/workshop1", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/workshops/workshop1.html" || "public/workshops/workshop1.html");
  res.sendFile(path);
});
app.get("/workshop2", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/workshops/workshop2.html" || "public/workshops/workshop2.html");
  res.sendFile(path);
});
app.get("/workshop3", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/workshops/workshop3.html" || "public/workshops/workshop3.html");
  res.sendFile(path);
});

// ____________________________________________________________________________________

const domainURL = process.env.DOMAIN || "http://localhost:3000";

// Handle creating checkout sessions only if Stripe is initialized
app.post("/create-checkout-session/:pid", async (req, res) => {
  if (!stripe) {
    return res.status(500).json({
      error: "Stripe API is not configured. Please set your SECRET_KEY environment variable."
    });
  }

  try {
    const priceId = req.params.pid;
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${domainURL}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/cancel`,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
    });
    
    res.json({
      id: session.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server listening:
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
  console.log(`You may access your app at: ${domainURL}`);
});

