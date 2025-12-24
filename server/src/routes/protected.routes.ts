const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const ProtectedRoutes  = express.Router();


ProtectedRoutes.get('/protected-route', verifyToken , (req , res) => {
    res.status(200).json({success:true, user_id:req.user})
});

module.exports = ProtectedRoutes;