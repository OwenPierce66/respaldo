import React, { useState } from "react";
import axios from "axios";

const SharedTaskModal = ({ isOpen, onClose, taskId, onShared }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userTokenLG");
const res = await axios.post(
  "http://127.0.0.1:8000/api/shared-tasks/",
  { task_id: taskId, description },
  {
    headers: {
      Authorization: `Token ${token}`,
    },
  }
);

      if (onShared) onShared({ server: res.data, taskId, description }); // callback opcional
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error al compartir:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Compartir tarea</h2>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribe un comentario..."
          className="w-full p-2 border rounded-lg mb-4"
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Compartiendo..." : "Compartir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedTaskModal;
