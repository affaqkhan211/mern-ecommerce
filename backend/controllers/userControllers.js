import User from "../models/userModel.js";
import sendToken from "../utils/jwtTokens.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({
      name,
      email,
      password,
      avatar: {
        public_id: "this is public id",
        url: "url",
      },
    });

    const savedUser = await newUser.save();

    sendToken(savedUser, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter email and password",
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not exist",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      message : "Something went wrong",
      error,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Token has been expired",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password does not match",
    });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  try {
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const userOwnDetailController = async (req,res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success : true,
      user
    })
  } catch (error) {
    res.status(500).json({
      success : false,
      message : "Something went wrong"
    })
  }
}

export const updateUserPasswordController = async (req,res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
      return res.status(400).json({
        success : false,
        message : "old password is not correct"
      })
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Something went wrong"
    })
  }
}

export const updateUserProfileController = async (req,res) => {
  try {
    const newUserData = {
      name : req.body.name,
      email : req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
      new : true,
      runValidators : true,
    });

    return res.status(200).json({
      success : true,
      user
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Something went wrong"
    })
  }
}

export const getAllUsersDetailController = async (req,res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success : true,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Something went wrong"
    })
  }
}

export const getSingleUserDetailController = async (req,res) => {
  try {
    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(401).json({
        success : false,
        message : "User not found"
      })
    }

    return res.status(200).json({
      success : true,
      user
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Something went wrong"
    })
  }
}

export const updateUserRoleController = async (req,res) => {
  try {
    const newUserData = {
      name : req.body.name,
      email : req.body.email,
      role : req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
      new : true,
      runValidators : true,
    });

    return res.status(200).json({
      success : true,
      user
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "Something went wrong"
    })
  }
}

export const deleteUserController = async (req,res) => {
  try {
    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(400).json({
        success : false,
        message : "User not found"
      })
    }

    await user.remove();
    return res.status(200).json({
      success : true,
      message : "user deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success : false,
      message : "something went wrong"
    })
  }
}