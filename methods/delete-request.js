const writeToFile = require("../util/write-to-file");

module.exports = (req, res) => {
  let baseURL = req.url.substring(0, req.url.lastIndexOf("/") + 1);
  const len = req.url.split("/").length;
  const id = req.url.split("/")[len - 1];
  const regexV4 = new RegExp(
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  );

  if (regexV4.test(id) && baseURL === "/api/delete-movie/") {
    res.setHeader("Content-Type", "application/json");

    const index = req.movies.findIndex((movie) => {
      return movie.id === id;
    });

    if (index === -1) {
      res.statusCode = 404;
      res.write(
        JSON.stringify({ title: "Not Found", message: "Movie Not Found!" })
      );
      res.end();
    } else {
      // req.movies = req.movies.filter((movie) => movie.id !== id); // using filter
      req.movies.splice(index, 1); // using splice
      writeToFile(req.movies);
      res.writeHead(204, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "Movie Deleted",
          message: "Movie deleted successfully",
        })
      );
    }
  } else if (!regexV4.test(id) && baseURL === "/api/delete-movie/") {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        title: "Validation Failed",
        message: "UUID is not valid",
      })
    );
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.write(
      JSON.stringify({ title: "Not Found", message: "Route Not Found!" })
    );
    res.end();
  }
};