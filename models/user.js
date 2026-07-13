const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        
        email: {
            type: String,
            required: true,
            unique: true,
            trim : true,
            lowercase:true
        },
        password: {
            type: String,
            required: true
            
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("User", userSchema);