const Company = require("../models/companies");

const sockets = async (io, socket) => {
  socket.on("searchQuery", async (data) => {
    const regex = /^\d+$/;
    let response;
    if (!data.query) {
      response = await Company.find();
    } else {
      if (regex.test(data.query)) {
        const regex = /^\d{9}$/;
        if (regex.test(data.query)) {
          response = await Company.find({ siren: data.query });
        } else {
          response = await Company.find({ siret: data.query });
        }
      } else {
        response = await Company.find({ companyName: data.query });
      }
    }

    socket.emit("searchResults", { companies: response });
  });
};

module.exports = sockets;
