const basicRoute = (req, res) => {
    res.status(200).render("index.ejs" );
};

const chatRoute = (req, res) => {
    res.status(200).render("chats.ejs");
};

module.exports = {basicRoute, chatRoute};