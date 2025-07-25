import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Task } from '../models/Task';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter: any = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalTasks: total,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    
    if (!task) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskData = req.body;
    
    const task = new Task(taskData);
    await task.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to create task'
    });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to update task'
    });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
};