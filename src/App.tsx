import { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Plus, Filter, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Toaster, toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  deadline: Date | null;
  status: TaskStatus;
  createdAt: Date;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [activeTab, setActiveTab] = useState<TaskStatus | 'all'>('all');

  // Check for deadline reminders
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      tasks.forEach(task => {
        if (task.deadline && task.status !== 'completed') {
          const deadline = new Date(task.deadline);
          const timeDiff = deadline.getTime() - now.getTime();
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          // Show toast for tasks due within 24 hours
          if (hoursDiff > 0 && hoursDiff <= 24) {
            const hoursRemaining = Math.floor(hoursDiff);
            toast.warning(`Reminder: "${task.title}" is due in ${hoursRemaining} hours!`, {
              duration: 5000,
            });
          }
        }
      });
    };

    // Check on mount and every 30 minutes
    checkDeadlines();
    const interval = setInterval(checkDeadlines, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setIsDialogOpen(false);
    toast.success('Task created successfully!');
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData }
          : task
      ));
      setEditingTask(null);
      setIsDialogOpen(false);
      toast.success('Task updated successfully!');
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully!');
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
    toast.success('Task status updated!');
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = activeTab === 'all' || task.status === activeTab;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by deadline (soonest first, null last)
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    
    // Finally by created date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getTaskCount = (status: TaskStatus | 'all') => {
    if (status === 'all') return tasks.length;
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            x: [-50, 50, -50],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              Project Task Organizer
            </h1>
            <Sparkles className="w-8 h-8 text-pink-600" />
          </motion.div>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Manage your tasks with priority levels and deadline tracking
          </motion.p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTask(null)} className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-transform hover:scale-105 active:scale-95">
                <Plus className="w-4 h-4" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                <DialogDescription>
                  {editingTask ? 'Update the details of your task.' : 'Fill in the details to create a new task.'}
                </DialogDescription>
              </DialogHeader>
              <TaskForm
                onSubmit={editingTask ? handleEditTask : handleAddTask}
                onCancel={closeDialog}
                initialData={editingTask || undefined}
              />
            </DialogContent>
          </Dialog>

          <div className="flex gap-2 items-center ml-auto">
            <Filter className="w-4 h-4 text-purple-600" />
            <Select value={priorityFilter} onValueChange={(value: Priority | 'all') => setPriorityFilter(value)}>
              <SelectTrigger className="w-[150px] border-purple-200 hover:border-purple-400 transition-all hover:scale-105">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TaskStatus | 'all')} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-purple-100 h-auto p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <span className="truncate">All ({getTaskCount('all')})</span>
              </TabsTrigger>
              <TabsTrigger value="todo" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <span className="truncate">To Do ({getTaskCount('todo')})</span>
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <span className="truncate hidden sm:inline">In Progress ({getTaskCount('in-progress')})</span>
                <span className="truncate sm:hidden">Progress ({getTaskCount('in-progress')})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-2">
                <span className="truncate hidden sm:inline">Completed ({getTaskCount('completed')})</span>
                <span className="truncate sm:hidden">Done ({getTaskCount('completed')})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <AnimatePresence mode="wait">
                {sortedTasks.length === 0 ? (
                  <motion.div 
                    className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-purple-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.p 
                      className="text-gray-500"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      No tasks found. Create your first task to get started!
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AnimatePresence mode="popLayout">
                      {sortedTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          layout
                        >
                          <TaskCard
                            task={task}
                            onEdit={openEditDialog}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
