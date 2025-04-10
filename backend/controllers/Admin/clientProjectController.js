const ClientProjectSchema = require('../../models/ClientProjectSchema');




/**************************************************** 
        Add Client Project
****************************************************/
const addClientProject = async (req, res) => {

    try {
        const {
            img,
            title,
            desc,
            tech,
            timeframe,
            priceRange,
            completionDate,
            type
        } = req.body;

        // Create new project
        const newProject = new ClientProjectSchema({
            img,
            title,
            desc,
            tech,
            timeframe: {
                start: new Date(timeframe.start),
                end: new Date(timeframe.end)
            },
            priceRange,
            completionDate: completionDate ? new Date(completionDate) : null,
            type
        });

        // Save to database
        const savedProject = await newProject.save();

        res.status(201).json({
            success: true,
            message: 'Client project added successfully',
            data: savedProject
        });
    } catch (error) {
        console.error('Error adding client project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add client project',
            error: error.message
        });
    }
};





/**************************************************** 
        get All Client Project
****************************************************/
const getAllProjects = async (req, res) => {
    try {
        const projects = await ClientProjectSchema.find({}).sort({
            createdAt: -1
        })
        res.status(200).json({
            success: true,
            message: 'Client projects retrieved successfully',
            data: projects
        });
    } catch (error) {
        console.error('Error retrieving client projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve client projects',
            error: error.message
        });
    }
};





/**************************************************** 
            Update Client Project
****************************************************/
const updateClientProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const updatedProject = await ClientProjectSchema.findByIdAndUpdate(projectId, req.body, {
            new: true
        });
        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: 'Client project not found',
                error: 'Project not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Client project updated successfully',
            data: updatedProject
        });
    } catch (error) {
        console.error('Error updating client project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update client project',
            error: error.message
        });
    }
};





/**************************************************** 
            get by Id Client Project
****************************************************/
const getClientProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await ClientProjectSchema.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Client project not found',
                error: 'Project not found'
            });
        }
        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Error getting client project by id:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get client project by id',
            error: error.message
        });
    }
};






/**************************************************** 
            Delete Client Project
****************************************************/
const deleteClientProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await ClientProjectSchema.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Client project not found',
                error: 'Project not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Client project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting client project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete client project',
            error: error.message
        });
    }
};




module.exports = {
    addClientProject,
    getAllProjects,
    getClientProjectById,
    updateClientProject,
    deleteClientProject
}

/**************************************************** 
            Koi sensetive data nh hai ✅
****************************************************/

