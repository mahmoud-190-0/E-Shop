const router = require("express").Router();

const authController = require("../controllers/authController");
const {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
    updateAddress,
} = require("../controllers/addressController");
const {
    addAddressValidator,
    removeAddressValidator,
    updateAddressValidator,
} = require("../utils/Validators/addressValidator");

// All address routes require authentication
router.use(authController.protect);

// GET /addresses  → list all addresses for the logged-in user
// POST /addresses → add a new address
router
    .route("/")
    .get(getLoggedUserAddresses)
    .post(addAddressValidator, addAddress);

// PUT /addresses/:addressId → update a specific address
router.put("/:addressId", updateAddressValidator, updateAddress);

// DELETE /addresses/:addressId → remove a specific address
router.delete("/:addressId", removeAddressValidator, removeAddress);

module.exports = router;