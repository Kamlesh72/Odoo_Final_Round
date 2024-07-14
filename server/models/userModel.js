import mongoose from 'mongoose';
import ROLES from '../constants/ROLES.js';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'active',
        },
        profilePicture: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            default: ROLES.USER,
        },
    },
    { timestamps: true }
);

const User = mongoose.model('users', userSchema);

export default User;
