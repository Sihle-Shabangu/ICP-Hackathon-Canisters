import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';

// Mock storage for tasks (replace with actual storage solution as needed)

// Task interface
class Task {
    id: string;
    title: string;
    description: string;
    assignedTo: string | null; // Can be user ID or null for unassigned tasks
    createdAt: Date;
}

const taskStorage = StableBTreeMap<string, Task>(0);
// Express setup
export default Server(() => {
    
    const app = express();
    app.use(express.json());
    
    // Route to create a task
    app.post('/tasks', (req: Request, res: Response) => {
        const { title, description } = req.body;
        const id = uuidv4();
        const task: Task = {
            id,
            title,
            description,
            assignedTo: null,
            createdAt: new Date()
        };
        taskStorage.insert(task.id, task)
        res.json(task);
    });


    
    // Route to get all tasks
    app.get('/tasks', (req: Request, res: Response) => {
        res.json(taskStorage.values());
    });


    // Route to get a specific task by ID
    app.get('/tasks/:id', (req: Request, res: Response) => {
        const taskid = req.params.id;
        const task = taskStorage.get(taskid);
        if (!task) {
            res.status(404).send('Task not found');
        } else {
            res.json(task.Some);
        }
    });
    
    // Route to assign a task to a user
    // app.put('/tasks/:id/assign', (req: Request, res: Response) => {
    //     const taskid = req.params.id;
    //     const task = taskStorage.get(taskid);
    //     if (!task) {
    //         res.status(404).send('Task not found');
    //     } else {
    //         const taskToUpdate = task.Some;
    //         const updatedTask = {...taskToUpdate, ...req.body, id: getNewId()};
    //         taskStorage.insert(taskToUpdate.id, updatedTask)
    //         res.json(updatedTask);
    //     }
    // });
    
    // Route to delete a task
    app.delete('/tasks/:id', (req: Request, res: Response) => {
        const taskId = req.params.id;
        const deletedTask = taskStorage.remove(taskId)
        if (!deletedTask) {
            res.status(404).send(`Couldn't delete task with id=${taskId}. Task not found`);
        } else {
            res.json(deletedTask.Some);
        }
    });
    
    // Start the Express server
    const port = process.env.PORT || 3000;
    return app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});

function getNewId(){
    return uuidv4();
}
