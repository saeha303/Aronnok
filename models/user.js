var mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const BCRYPT_ROUNDS = 10;

var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      maxlength: 32,
    },
    lastname: {
      type: String,
      maxlength: 32,
    },
    username: {
        type: String,
        unique: true,
        required:true,
        maxlength: 32,
      },
      dob: {
        type: Date,
        maxlength: 12,
      },
      religion: {
        type: String,
        maxlength: 32,
      },
      mobile: {
        type: Number,
        required:true,
        maxlength: 11,
      },
    email: {
      type: String,
      required: true,
      unique: true
    },
    present_addr: {
      type: String,
      maxlength:100,
      trim: true
    },
    encry_password: {
      type: String,
      required: true
    },
    salt: String,
    //MERN
    role: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    }
    // purchases: {
    //   type: Array,
    //   default: []
    // },

  }
  ,
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = undefined; // bcrypt stores its own salt inside the hash
    this.encry_password = bcrypt.hashSync(password, BCRYPT_ROUNDS);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  // Returns a Promise<boolean>. Accounts created before the switch to bcrypt
  // still have an HMAC-SHA256 hash + salt; they are upgraded on next login.
  authenticate: async function(plainpassword) {
    if (!plainpassword || !this.encry_password) return false;

    if (this.encry_password.startsWith("$2")) {
      return bcrypt.compare(plainpassword, this.encry_password);
    }

    const legacyHash = crypto
      .createHmac("sha256", this.salt || "")
      .update(plainpassword)
      .digest("hex");
    const matches = legacyHash.length === this.encry_password.length &&
      crypto.timingSafeEqual(Buffer.from(legacyHash), Buffer.from(this.encry_password));
    if (matches) {
      this.password = plainpassword; // re-hash with bcrypt
      await this.save();
    }
    return matches;
  }
};

// Never send password hashes to the client, wherever a user is serialised.
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.encry_password;
    delete ret.salt;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);