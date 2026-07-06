exports.isAuthenticated = (req, res, next) => {

    if (req.session.user) {

        return next();

    }

    return res.redirect("/login");

};

exports.isGuest = (req, res, next) => {

    if (req.session.user) {

        return res.redirect("/");

    }

    next();

};