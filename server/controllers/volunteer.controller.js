import { Volunteer } from '../models/volunteer.model.js';

export const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll();
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching volunteers' });
    }
};

export const getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching volunteer' });
    }
};

export const createVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.create(req.body);
        res.status(201).json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating volunteer' });
    }
};

export const updateVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.update(req.params.id, req.body);
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating volunteer' });
    }
};

export const deleteVolunteer = async (req, res) => {
    try {
        await Volunteer.delete(req.params.id);
        res.json({ message: 'Volunteer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting volunteer' });
    }
};
