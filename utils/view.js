const path = require("path");

function view(page, res) {

    res.sendFile(
        path.join(__dirname, "..", "views", `${page}.html`)
    );

}

module.exports = view;