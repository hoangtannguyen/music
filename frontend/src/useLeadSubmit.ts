import { useState, type FormEvent } from "react";
import { submitLead } from "./utils";

// Shared submit flow for the quick-quote form and the booking form
export function useLeadSubmit(onToast: (message: string) => void, onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubmitting(true);
    try {
      await submitLead(form);
      onToast("Cảm ơn bạn! Event Pro đã nhận yêu cầu và sẽ liên hệ báo giá trong thời gian sớm nhất.");
      form.reset();
      onSuccess?.();
    } catch {
      onToast("Gửi chưa thành công. Vui lòng gọi hotline 0987 654 321 hoặc nhắn Zalo để được hỗ trợ ngay.");
    } finally {
      setSubmitting(false);
    }
  }

  return { submitting, handleSubmit };
}
