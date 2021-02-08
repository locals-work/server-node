const record_modal = require("../models/RecordModel");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

exports.create_record = [
  async (req, res) => {
    try {
      const { body, headers } = req;

      var info = new user_modal({
        ...body,
        created_by: mongoose.Types.ObjectId(headers["x-user"]),
      });
      var response = await info.save();

      return apiResponse.successResponseWithData(
        res,
        "record creation success",
        response
      );
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.errorResponse(res, err);
    }
  },
];
