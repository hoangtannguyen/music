import { useEffect, useState } from "react";

interface ImageFieldProps {
  currentUrl: string | null;
  required: boolean;
}

// File input with a preview of the chosen file, or of the current image when editing
export default function ImageField({ currentUrl, required }: ImageFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  return (
    <label className="form-group full">
      <span className="form-label">Ảnh {required && <span className="req">*</span>}</span>
      <div className="admin-image-field">
        {(preview ?? currentUrl) && <img src={preview ?? currentUrl ?? ""} alt="" />}
        <div>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            required={required}
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
          <small>JPEG, PNG hoặc WebP, tối đa 5 MB.{currentUrl && " Bỏ trống để giữ ảnh hiện tại."}</small>
        </div>
      </div>
    </label>
  );
}
