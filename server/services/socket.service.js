import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust for production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join', (role) => {
            socket.join(role);
            console.log(`Socket ${socket.id} joined room: ${role}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const emitIncident = (incident) => {
    if (io) {
        // Emit to everyone
        io.emit('new_incident', incident);
        // Specifically emit to authority for prioritized view
        io.to('authority').emit('admin_notification', {
            message: `URGENT: New ${incident.type} incident reported!`,
            incident
        });
    }
};

export const emitStatusUpdate = (incidentId, status) => {
    if (io) {
        io.emit('status_updated', { id: incidentId, status });
    }
};

export const emitIncidentUpdate = (incident) => {
    if (io) {
        io.emit('incident_updated', incident);
    }
};

export const emitIncidentDelete = (id) => {
    if (io) {
        io.emit('incident_deleted', { id });
    }
};

export const emitResourceUpdate = (resource) => {
    if (io) {
        io.emit('resource_updated', resource);
        // Alert authorities about inventory changes
        io.to('authority').emit('admin_notification', {
            message: `Inventory Update: ${resource.name} has been updated.`,
            type: 'inventory'
        });
    }
};

export const emitResourceDelete = (id) => {
    if (io) {
        io.emit('resource_deleted', { id });
        io.to('authority').emit('admin_notification', {
            message: `Inventory Alert: A resource has been decommissioned.`,
            type: 'inventory'
        });
    }
};
