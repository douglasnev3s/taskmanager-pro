import { connectDB, disconnectDB, isConnected } from '../config/database';
import { Task, TaskPriority, TaskStatus } from '../models/Task';

export const testCRUDOperations = async (): Promise<void> => {
  try {
    console.log('🧪 Starting CRUD operations test...');
    
    if (!isConnected()) {
      console.log('🔌 Connecting to database...');
      await connectDB();
    }

    // Create operation
    console.log('\n📝 Testing CREATE operation...');
    const newTask = new Task({
      title: 'Test Task',
      description: 'This is a test task for CRUD operations',
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      tags: ['test', 'crud', 'database']
    });

    const savedTask = await newTask.save();
    console.log('✅ Task created:', {
      id: savedTask.id,
      title: savedTask.title,
      priority: savedTask.priority
    });

    // Read operation
    console.log('\n📖 Testing READ operations...');
    
    // Find by ID
    const foundTask = await Task.findById(savedTask.id);
    console.log('✅ Task found by ID:', foundTask?.title);

    // Find all tasks
    const allTasks = await Task.find();
    console.log(`✅ Total tasks in database: ${allTasks.length}`);

    // Find by priority
    const highPriorityTasks = await Task.findByPriority(TaskPriority.HIGH);
    console.log(`✅ High priority tasks: ${highPriorityTasks.length}`);

    // Find pending tasks
    const pendingTasks = await Task.findPending();
    console.log(`✅ Pending tasks: ${pendingTasks.length}`);

    // Update operation
    console.log('\n✏️ Testing UPDATE operation...');
    if (foundTask) {
      foundTask.title = 'Updated Test Task';
      foundTask.status = TaskStatus.COMPLETED;
      foundTask.tags.push('updated');
      
      const updatedTask = await foundTask.save();
      console.log('✅ Task updated:', {
        title: updatedTask.title,
        status: updatedTask.status,
        tags: updatedTask.tags
      });

      // Test instance methods
      await updatedTask.markIncomplete();
      console.log('✅ Task marked incomplete using instance method');
      
      await updatedTask.addTag('method-test');
      console.log('✅ Tag added using instance method');
    }

    // Test static methods
    console.log('\n🔍 Testing static methods...');
    const completedTasks = await Task.findCompleted();
    console.log(`✅ Completed tasks: ${completedTasks.length}`);

    const testTagTasks = await Task.findByTag('test');
    console.log(`✅ Tasks with 'test' tag: ${testTagTasks.length}`);

    // Create another task for more testing
    const secondTask = await Task.create({
      title: 'Second Test Task',
      description: 'Another test task',
      priority: TaskPriority.LOW,
      tags: ['test', 'second']
    });
    console.log('✅ Second task created');

    // Delete operation
    console.log('\n🗑️ Testing DELETE operation...');
    const deleteResult = await Task.findByIdAndDelete(savedTask.id);
    console.log('✅ Task deleted:', deleteResult?.title);

    // Clean up
    await Task.findByIdAndDelete(secondTask.id);
    console.log('✅ Second task deleted');

    console.log('\n🎉 All CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('❌ CRUD test failed:', error);
    throw error;
  }
};

export const runDatabaseTest = async (): Promise<void> => {
  try {
    await testCRUDOperations();
    console.log('\n📊 Database connection info:');
    console.log('Connection state:', isConnected() ? 'Connected' : 'Disconnected');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    if (isConnected()) {
      await disconnectDB();
      console.log('🔌 Database connection closed');
    }
  }
};

// Run test if called directly
if (require.main === module) {
  runDatabaseTest().then(() => {
    console.log('✅ Test completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
}