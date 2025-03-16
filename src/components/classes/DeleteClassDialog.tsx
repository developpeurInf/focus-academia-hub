
import React, { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
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

type DeleteClassDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  classId: string;
  className: string;
};

const DeleteClassDialog: React.FC<DeleteClassDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  classId,
  className,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { accessToken } = useAuth();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.deleteClass(classId);
      toast.success('Class removed', {
        description: `${className} has been removed from the system.`
      });
      onConfirm();
    } catch (error) {
      console.error('Error removing class:', error);
      toast.error('Failed to remove class', {
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
          <AlertDialogTitle>Remove Class</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove {className} from the system? This action cannot be undone.
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

export default DeleteClassDialog;
