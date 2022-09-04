const mongoose = require('mongoose')

// Create userSchema :: define an object that defines its fields
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        userUrl: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            default: ""
        },
        photo: {
            type: String,
            default: ""
        },
        fields: {
            type: String,
            default: ""
        },
        shortBio: {
            type: String,
            default: ""
        },
        work: {
            type: String,
            default: ""
        },
        keywords: {
            type: String,
            default: ""
        },
        websiteLink: {
            type: String,
            default: ""
        },
        gitHubLink: {
            type: String,
            default: ""
        },
        facebookLink: {
            type: String,
            default: ""
        },
        youtubeLink: {
            type: String,
            default: ""
        },
        twitterLink: {
            type: String,
            default: ""
        },
        instagramLink: {
            type: String,
            default: ""
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", UserSchema);

module.exports = User;