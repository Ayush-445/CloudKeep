"use client";

import React from "react";
import { Modal, Button } from "@heroui/react";
import { LucideIcon } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger" | "secondary";
  onConfirm: () => void;
  isDangerous?: boolean;
  warningMessage?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  icon: Icon,
  iconColor = "text-red-500",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  isDangerous = false,
  warningMessage,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {/* HEADER */}
      <Modal.Header className="flex gap-2 items-center">
        {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
        <span>{title}</span>
      </Modal.Header>

      {/* BODY */}
      <Modal.Body>
        {isDangerous && warningMessage && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              {Icon && (
                <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
              )}
              <div>
                <p className="font-medium">
                  This action cannot be undone
                </p>
                <p className="text-sm mt-1">{warningMessage}</p>
              </div>
            </div>
          </div>
        )}
        <p>{description}</p>
      </Modal.Body>

      {/* FOOTER */}
      <Modal.Footer>
        <Button
          variant="ghost"
          onClick={() => onOpenChange(false)}
        >
          {cancelText}
        </Button>

        <Button
          variant={confirmVariant}
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;