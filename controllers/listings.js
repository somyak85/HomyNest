const Listing = require("../models/listing");

const listingController = {
  index: async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  },

  renderNewForm: (req, res) => {
    res.render("listings/new");
  },

  showListing: async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "The Home you're trying to access has been removed");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show", { listing });
  },

  createListing: async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Home added!");
    res.redirect("/listings");
  },

  editListing: async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested for doesn't exist");
      return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit", { listing, originalUrl });
  },

  updateListing: async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
    req.flash("success", "Updated!");
    res.redirect(`/listings/${id}`);
  },

  deleteListing: async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "home removed :(!");
    res.redirect("/listings");
  },
};

module.exports = listingController;
