// /src/components/VideoModal.jsx
import React from "react";
import "../styles/VideoModal.css";

export default function VideoModal({ saree, onClose }) {
  if (!saree) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>{saree.name} — Preview</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {/* HTML5 video — works with direct file URLs or S3 pre-signed URLs */}
        <video className="modal-video" controls autoPlay>
          <source src={saree.videoUrl} type="video/mp4" />
          Your browser does not support video playback.
        </video>
        {/* TODO: For YouTube/Vimeo URLs, use an <iframe> instead:
            <iframe src={`https://www.youtube.com/embed/${youtubeId}`} ... />
        */}
      </div>
    </div>
  );
}
