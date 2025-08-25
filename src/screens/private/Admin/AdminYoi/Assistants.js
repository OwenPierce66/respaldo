import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { CSVLink } from "react-csv";

export default function Assistants({ className, assistants }) {
  const headers = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Years", key: "years" },
    { label: "Reasons", key: "allReasons" },
    { label: "Gifts", key: "allGifts" },
    { label: "Suggestions", key: "allSuggestions" },
    { label: "Classes or Messages", key: "allClasses" },
    { label: "Date", key: "created" },
  ];

  return (
    <div className={className}>
      <div className="adminTable">
        <div className="adminTableHeader">
          <div className="adminTableHeader-title">YOI Assistants List</div>
          <CSVLink data={assistants} headers={headers}>
            <FontAwesomeIcon
              className="adminExcelExport"
              icon={faFileExcel}
            />
          </CSVLink>
        </div>
        <div className="adminTableBody">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Years</th>
                <th>Reason</th>
                <th>Gift</th>
                <th>Suggestion</th>
                <th>Class or Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {assistants.map((assistant) => {
                return (
                  <tr key={assistant.id}>
                    <td>{assistant.id}</td>
                    <td>{assistant.name}</td>
                    <td>{assistant.years}</td>
                    <td className="assistants-excess-table-data">{assistant.reasonOne}</td>
                    <td className="assistants-excess-table-data">{assistant.giftOne}</td>
                    <td className="assistants-excess-table-data">{assistant.suggestionOne}</td>
                    <td className="assistants-excess-table-data">{assistant.classOne}</td>
                    <td>{assistant.created}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="adminTableFooter"></div>
        </div>
      </div>
    </div>
  );
}
