// src/components/Dashboard/traductor/SharedTaskModal.js
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const getToken = () =>
  localStorage.getItem("userTokenLG") ||
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  "";

const SharedTaskModal = ({ isOpen, onClose, taskId, onShared }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      Modal.setAppElement("#root");
    } catch {}
  }, []);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setLoading(false);
    } else {
      setDescription("");
      setErrorMsg("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleShare = async (e) => {
    e?.preventDefault?.();

    if (!taskId) {
      setErrorMsg("No se pudo compartir: taskId vacío.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const token = getToken();

      const res = await axios.post(
        `${API_BASE}/api/shared-tasks/`,
        { task_id: taskId, description },
        {
          headers: token ? { Authorization: `Token ${token}` } : {},
        }
      );

      onShared?.({ server: res.data, taskId, description });
      setDescription("");
      onClose?.();
    } catch (error) {
      console.error("Error al compartir:", error);
      setErrorMsg("Error al compartir. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={!!isOpen}
      onRequestClose={() => {
        if (!loading) onClose?.();
      }}
      shouldCloseOnOverlayClick={!loading}
      shouldCloseOnEsc={!loading}
      contentLabel="Compartir tarea"
      overlayClassName="sharedtask-overlay"
      className="sharedtask-modal"
    >
      <form onSubmit={handleShare}>
        <div className="sharedtask-header">
          <h2 className="sharedtask-title">Compartir tarea</h2>

          <button
            type="button"
            className="sharedtask-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar"
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribe un comentario..."
          className="sharedtask-textarea"
          rows={3}
          disabled={loading}
        />

        {errorMsg ? <div className="sharedtask-error">{errorMsg}</div> : null}

        <div className="sharedtask-actions">
          <button
            type="button"
            onClick={onClose}
            className="sharedtask-btn sharedtask-btn--cancel"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="sharedtask-btn sharedtask-btn--primary"
            disabled={loading}
          >
            {loading ? "Compartiendo..." : "Compartir"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SharedTaskModal;
