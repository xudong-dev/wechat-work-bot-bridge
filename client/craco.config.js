require("dotenv/config");

module.exports = {
  devServer: {
    proxy: {
      "/graphql": process.env.SERVER_URL,
      "/webhooks/*/send": process.env.SERVER_URL
    }
  }
};
