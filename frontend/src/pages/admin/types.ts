import { ValidationError } from "../../adminApi";

export interface AdminPanelProps {
  auth: string;
  onToast: (message: string) => void;
  // Handles 401 (back to login) and network errors; validation errors stay with the panel
  onError: (error: unknown) => void;
}

// Rails returns English messages; show them next to the Vietnamese field label
export function validationMessages(error: ValidationError, labels: Record<string, string>): string[] {
  return Object.entries(error.errors).flatMap(([field, messages]) =>
    messages.map((message) => (labels[field] ?? field) + ": " + message)
  );
}
