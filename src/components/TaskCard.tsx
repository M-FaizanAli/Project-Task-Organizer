import { Task, TaskStatus } from '../App';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Clock, MoreVertical, Edit, Trash2, AlertCircle } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'medium':
        return 'bg-gradient-to-r from-orange-500 to-yellow-500';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getPriorityGlow = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'shadow-red-500/20';
      case 'medium':
        return 'shadow-yellow-500/20';
      case 'low':
        return 'shadow-green-500/20';
      default:
        return 'shadow-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'todo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDeadlineStatus = () => {
    if (!task.deadline || task.status === 'completed') return null;
    
    const deadline = new Date(task.deadline);
    const now = new Date();
    
    if (isPast(deadline) && !isToday(deadline)) {
      return { text: 'Overdue', color: 'text-red-600', urgent: true };
    }
    
    if (isToday(deadline)) {
      return { text: 'Due today', color: 'text-orange-600', urgent: true };
    }
    
    if (isTomorrow(deadline)) {
      return { text: 'Due tomorrow', color: 'text-yellow-600', urgent: false };
    }
    
    const daysUntil = differenceInDays(deadline, now);
    if (daysUntil <= 7) {
      return { text: `Due in ${daysUntil} days`, color: 'text-blue-600', urgent: false };
    }
    
    return null;
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`relative overflow-hidden transition-all hover:shadow-2xl bg-white/90 backdrop-blur-sm border-purple-100 ${
        deadlineStatus?.urgent ? 'ring-2 ring-red-400 animate-pulse' : ''
      } ${getPriorityGlow(task.priority)}`}>
        {/* Priority indicator bar with gradient */}
        <motion.div 
          className={`absolute top-0 left-0 right-0 h-1 ${getPriorityColor(task.priority)}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <motion.h3 
                className={`text-gray-900 mb-2 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {task.title}
              </motion.h3>
              <div className="flex flex-wrap gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Badge variant="outline" className={getStatusColor(task.status)}>
                    {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Completed'}
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Badge className={`${getPriorityColor(task.priority)} text-white border-0 shadow-lg`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                </motion.div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-purple-100 transition-transform hover:rotate-90 hover:scale-110">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')} disabled={task.status === 'todo'}>
                Move to To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')} disabled={task.status === 'in-progress'}>
                Move to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'completed')} disabled={task.status === 'completed'}>
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        {task.description && (
          <CardContent className="pb-3">
            <motion.p 
              className="text-gray-600 text-sm line-clamp-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {task.description}
            </motion.p>
          </CardContent>
        )}
        
        <CardFooter className="flex flex-col items-start gap-2 pt-3 border-t border-purple-100">
          {task.deadline && (
            <motion.div 
              className="flex items-center gap-2 w-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Clock className={`w-4 h-4 ${deadlineStatus?.color || 'text-purple-500'}`} />
              <span className={`text-sm ${deadlineStatus?.color || 'text-gray-600'}`}>
                {format(new Date(task.deadline), 'MMM dd, yyyy')}
                {deadlineStatus && (
                  <span className="ml-2">• {deadlineStatus.text}</span>
                )}
              </span>
            </motion.div>
          )}
          
          {deadlineStatus?.urgent && (
            <motion.div 
              className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 px-3 py-2 rounded-md w-full border border-red-200"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <AlertCircle className="w-4 h-4" />
              </motion.div>
              <span className="text-sm">Urgent: {deadlineStatus.text}!</span>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
