import { Task } from "../models/task.model";

export const TASK_DATA: Task[] = [
    {
        id: 1,
        assignedTo: "User1",
        dueDate: "12/10/2025",
        comments: "This Task is Good",
        status: "Completed",
        priority: "Low"
    },
    {
        id: 2,
        assignedTo: "User2",
        dueDate: "14/09/2024",
        comments: "This Task is Good",
        status: "In Progress",
        priority: "High"
    },
    {
        id: 3,
        assignedTo: "User3",
        dueDate: "18/08/2024",
        comments: "This Task is Good",
        status: "Not Started",
        priority: "Normal"
    }
];
