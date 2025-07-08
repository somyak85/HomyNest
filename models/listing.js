const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://miro.medium.com/v2/resize:fit:1080/1*aIvXWeYVEajk9wl7PBlpqQ.jpeg",
      set: (v) =>
        v === ""
          ? "https://miro.medium.com/v2/resize:fit:1080/1*aIvXWeYVEajk9wl7PBlpqQ.jpeg"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
