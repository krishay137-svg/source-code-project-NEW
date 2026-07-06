const view = require("../utils/view");

exports.showRegister = (req, res) => {

    view("register", res);

};

exports.showLogin = (req, res) => {

    view("login", res);

};

exports.register = (req, res) => {

    res.status(501).send("Registration will be implemented in Commit 2.");

};

exports.login = (req, res) => {

    res.status(501).send("Login will be implemented in Commit 3.");

};

exports.logout = (req, res) => {

    res.status(501).send("Logout will be implemented in Commit 4.");

};