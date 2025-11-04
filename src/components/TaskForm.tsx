import { useState } from 'react';
import { Task, Priority, TaskStatus } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Task;
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'todo');
  const [deadline, setDeadline] = useState<Date | undefined>(
    initialData?.deadline ? new Date(initialData.deadline) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      deadline: deadline || null,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setDeadline(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
        />
      </motion.div>

      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={4}
          className="border-purple-200 focus:border-purple-400 focus:ring-purple-200"
        />
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
            <SelectTrigger id="priority" className="border-purple-200 focus:border-purple-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
            <SelectTrigger id="status" className="border-purple-200 focus:border-purple-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Label>Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-purple-200 hover:border-purple-400 transition-all hover:scale-105"
              type="button"
            >
              <CalendarIcon className="w-4 h-4" />
              {deadline ? format(deadline, 'PPP') : 'Pick a deadline'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              initialFocus
            />
            {deadline && (
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setDeadline(undefined)}
                  type="button"
                >
                  Clear deadline
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </motion.div>

      <motion.div 
        className="flex gap-3 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-transform hover:scale-105 active:scale-95">
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-purple-200 hover:bg-purple-50 transition-transform hover:scale-105 active:scale-95">
          Cancel
        </Button>
      </motion.div>
    </form>
  );
}
