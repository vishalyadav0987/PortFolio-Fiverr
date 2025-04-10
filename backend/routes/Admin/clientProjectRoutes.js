const express = require('express');
const { addClientProject, getAllProjects, getClientProjectById, updateClientProject, deleteClientProject } = require('../../controllers/Admin/clientProjectController');
const router = express.Router();


router.route('/add-project').post(addClientProject);
router.get('/get-project',getAllProjects );
router.get('/get-project/:id', getClientProjectById);
router.put('/update-project/:id', updateClientProject);
router.delete('/delete-project/:id', deleteClientProject);


module.exports = router