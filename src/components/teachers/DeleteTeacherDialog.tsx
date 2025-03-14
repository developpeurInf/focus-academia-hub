
import React, { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteTeacherDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacherId: string;
  teacherName: string;
};

const DeleteTeacherDialog: React.FC<DeleteTeacherDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  teacherId,
  teacherName,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.deleteTeacher(teacherId);
      toast.success('Teacher removed', {
        description: `${teacherName} has been removed from the system.`
      });
      onConfirm();
    } catch (error) {
      console.error('Error removing teacher:', error);
      toast.error('Failed to remove teacher', {
        description: 'Please try again or contact support if the issue persists.'
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Teacher</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {teacherName} from the system? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeacherDialog;
