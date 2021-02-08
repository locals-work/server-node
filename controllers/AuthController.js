const user_modal = require("../models/UserModel");
var CryptoJS = require("crypto-js");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");

exports.create_user = [
  async (req, res) => {
    try {
      const { body, headers } = req;

      var info = new user_modal({
        ...body,
        password: CryptoJS.AES.encrypt(
          body.password,
          process.env.SALT
        ).toString(),
        created_by: mongoose.Types.ObjectId(headers["x-user"]),
      });
      var response = await info.save();

      return apiResponse.successResponseWithData(
        res,
        "user creation success",
        response
      );
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.update_user = [
  async (req, res) => {
    try {
      const { body, headers } = req;
      const { id } = req.params;

      var info = {
        username: body.username,
        name: body.name,
        role: body.role,
        active: body.active,
        password: CryptoJS.AES.encrypt(
          body.password,
          process.env.SALT
        ).toString(),
        updated_by: mongoose.Types.ObjectId(headers["x-user"]),
      };

      var response = await user_modal
        .findOneAndUpdate({ _id: id }, { ...info })
        .exec();

      return apiResponse.successResponseWithData(
        res,
        "user updated success",
        response
      );
    } catch (err) {
      console.log(err);
      //throw error in json response with status 500.
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.user_list = [
  async (req, res) => {
    try {
      var result = await user_modal.find().exec();

      return apiResponse.successResponseWithData(
        res,
        "user creation success",
        result
      );
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.delete_user = [
  async (req, res) => {
    const { id } = req.params;
    try {
      var result = await user_modal.deleteOne({
        _id: mongoose.Types.ObjectId(id),
      });

      return apiResponse.successResponseWithData(
        res,
        "user detetion success",
        result
      );
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.get_user = [
  async (req, res) => {
    const { id } = req.params;

    try {
      var result = await user_modal.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "created_by",
            foreignField: "_id",
            as: "created_by_name",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "updated_by",
            foreignField: "_id",
            as: "updated_by_name",
          },
        },
        {
          $project: {
            name: "$name",
            username: "$username",
            role: "$role",
            active: "$active",
            created_by: "$created_by_name.name",
            updated_by: "$updated_by_name.name",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
        {
          $unwind: {
            path: "$created_by",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$updated_by",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      if (result.length > 0) {
        result = result[0];
      }

      return apiResponse.successResponseWithData(res, "success", result);
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.login = [
  async (req, res) => {
    try {
      const { body } = req;
      const { username, password } = body;

      console.log(body);

      const data = await user_modal.findOne({ username });

      console.log(data);

      if (data) {
        var bytes = CryptoJS.AES.decrypt(data.password, process.env.SALT);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        console.log(originalText);

        if (originalText === password) {
          return apiResponse.successResponseWithData(res, "login success", {
            id: data._id,
            name: data.name,
            role: data.role,
          });
        } else {
          return apiResponse.unauthorizedResponse(res, "invalid password");
        }
      } else {
        return apiResponse.notFoundResponse(res, "user not found");
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];
