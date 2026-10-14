const express = require('express');
const router = express.Router();
const {
    compareTransportRoutes,
    getTransportRouteById,
    createTransportRoute
} = require('../controllers/transport.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/compare', compareTransportRoutes);
router.get('/search', compareTransportRoutes);
router.get('/:id', getTransportRouteById);
router.post('/', protect, authorizeRoles('ADMIN'), createTransportRoute);

module.exports = router;
