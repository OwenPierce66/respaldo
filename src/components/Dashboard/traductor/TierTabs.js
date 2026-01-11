import React from "react";

export default function TierTabs({ tabs, counts, activeKey, onChange }) {
  const safeTabs = Array.isArray(tabs) ? tabs : [];
  const safeCounts = counts || {};

  return (
    <div className="users-modal__tabs">
      {safeTabs.map((t) => {
        const active = activeKey === t.key;
        const count = safeCounts?.[t.key] ?? 0;

        return (
          <button
            key={t.key}
            type="button"
            className={`users-modal__tab ${active ? "is-active" : ""}`}
            onClick={() => onChange?.(t.key)}
          >
            {t.label}
            <span className="users-modal__tab-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
