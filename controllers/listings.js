const { Listing } = require("../models");

module.exports.Index = async (req, res) => {
    let lists = await Listing.find();
    res.render("./listings/index.ejs", { lists });
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let id = req.params.id;
    let list = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!list) {
        req.flash("error", "Listing Doesn't Exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let data = new Listing(req.body.listing);
    data.owner = req.user._id;
    data.image = { url, filename };
    await data.save();
    req.flash("success", "new Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let id = req.params.id;
    let list = await Listing.findById(id);
    let originalImageUrl = list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    if (!list) {
        req.flash("error", "Listing Doesn't Exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list,originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let id = req.params.id;
    let list = await Listing.findByIdAndUpdate(id, req.body.listing);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = {url,filename};
        await list.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
    let id = req.params.id;
    let data = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};