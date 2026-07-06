const path = require("path");

function errorHandler(err, req, res, next) {
    console.error("Unhandled error:", err);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;
    const message = err.expose ? err.message : "Internal server error";

    res.status(status).json({ error: message });
}

function notFound(req, res) {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API endpoint not found" });
    }
    res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html"));
}

module.exports = { errorHandler, notFound };
