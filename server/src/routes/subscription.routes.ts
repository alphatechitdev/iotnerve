const express = require('express')
const SubsRoutes = express.Router();
const PackagesController = require('../controllers/packages.controller');

SubsRoutes.get('/get-package/', async (req, res)=>{
   
    try {
        const Pkgs = new PackagesController();
        const packageValue = req.query.package;

        const packageDetails = await Pkgs.findPackage(packageValue);
        if (packageDetails) {
            console.log(packageDetails);
            res.status(200).json(packageDetails);
        } else {
            res.status(404).json({message: 'Package not found'})
        }

    } catch (error) {
        res.status(500).json("Internal Server Error")
    }
});

module.exports = SubsRoutes;