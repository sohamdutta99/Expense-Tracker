import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

/**
 * ProfilePhotoSelector
 * Lets the user pick a profile photo, shows a preview, and supports removal.
 * Dark-mode styled.
 */
const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div
          className="w-20 h-20 flex items-center justify-center rounded-full relative cursor-pointer"
          style={{ background: "rgba(124,58,237,0.15)", border: "2px dashed rgba(124,58,237,0.4)" }}
          onClick={() => inputRef.current.click()}
        >
          <LuUser className="text-3xl" style={{ color: "var(--color-primary-light)" }} />
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-full absolute -bottom-1 -right-1 text-white text-xs"
            style={{ background: "var(--color-primary)" }}
          >
            <LuUpload size={13} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile preview"
            className="w-20 h-20 rounded-full object-cover"
            style={{ border: "2px solid var(--color-primary)" }}
          />
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-full absolute -bottom-1 -right-1 text-white text-xs"
            style={{ background: "#ef4444" }}
            onClick={handleRemoveImage}
          >
            <LuTrash size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
