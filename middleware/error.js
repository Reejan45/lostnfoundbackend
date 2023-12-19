// for handling Resource error

const handleResourceNotFound = (req, res) => {
  res.status(404).send({
    msg: "Resource not found",
  });
};

// for handling server errors

const handleServerError = (err, req, res, next) => {
  let statuscode = 500;
  let message = "Server Error";

  if (err.name == "ValidationError") {
    statuscode = 400;
    message = "Bad request";
    let errors = [];
    
    // Check if err.errors is defined before mapping
    if (err.errors) {
      errors = Object.entries(err.errors).map((error) => {
        return {
          params: error[0],
          msg: error[1].message,
        };
      });
    }

    res.status(statuscode).send({
      msg: message + " " + err.message,
      errors,
    });
  } else {
    res.status(statuscode).send({
      msg: message + " " + err.message,
    });
  }
};

module.exports = {
  handleResourceNotFound,
  handleServerError,
};