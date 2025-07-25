import mongoose, { Document, Schema, Model } from 'mongoose';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  markComplete(): Promise<ITask>;
  markIncomplete(): Promise<ITask>;
  addTag(tag: string): Promise<ITask>;
  removeTag(tag: string): Promise<ITask>;
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  priority: {
    type: String,
    enum: {
      values: Object.values(TaskPriority),
      message: 'Priority must be one of: low, medium, high'
    },
    default: TaskPriority.MEDIUM,
    required: true,
    index: true
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
TaskSchema.index({ completed: 1, priority: -1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });
TaskSchema.index({ tags: 1 });
TaskSchema.index({ title: 'text', description: 'text' });

// Instance methods
TaskSchema.methods.markComplete = function() {
  this.completed = true;
  return this.save();
};

TaskSchema.methods.markIncomplete = function() {
  this.completed = false;
  return this.save();
};

TaskSchema.methods.addTag = function(tag: string) {
  if (!this.tags.includes(tag) && this.tags.length < 10) {
    this.tags.push(tag);
    return this.save();
  }
  return this;
};

TaskSchema.methods.removeTag = function(tag: string) {
  this.tags = this.tags.filter((t: string) => t !== tag);
  return this.save();
};

// Static methods
TaskSchema.statics.findByPriority = function(priority: TaskPriority) {
  return this.find({ priority });
};

TaskSchema.statics.findCompleted = function() {
  return this.find({ completed: true });
};

TaskSchema.statics.findPending = function() {
  return this.find({ completed: false });
};

TaskSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    completed: false
  });
};

TaskSchema.statics.findByTag = function(tag: string) {
  return this.find({ tags: tag });
};

// Pre-save middleware
TaskSchema.pre('save', function(next) {
  // Normalize tags
  if (this.tags) {
    this.tags = this.tags.map(tag => tag.toLowerCase().trim()).filter(Boolean);
    this.tags = [...new Set(this.tags)]; // Remove duplicates
  }
  next();
});

export interface ITaskModel extends Model<ITask> {
  findByPriority(priority: TaskPriority): Promise<ITask[]>;
  findCompleted(): Promise<ITask[]>;
  findPending(): Promise<ITask[]>;
  findOverdue(): Promise<ITask[]>;
  findByTag(tag: string): Promise<ITask[]>;
}

export const Task: ITaskModel = mongoose.model<ITask, ITaskModel>('Task', TaskSchema);