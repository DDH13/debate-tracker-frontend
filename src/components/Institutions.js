import React, { useCallback } from "react";
import MergeableEntityGrid from "./common/MergeableEntityGrid";
import { getInstitutions, mergeInstitutions } from "../services/api";

const columns = [
  { field: "id", headerName: "ID", flex: 0.1, sortable: true },
  { field: "name", headerName: "Institution Name", flex: 0.4, sortable: true },
  { field: "abbreviation", headerName: "Abbreviation", flex: 0.2, sortable: true },
  {
    field: "teamCount",
    headerName: "Team Count",
    type: "number",
    flex: 0.2,
    sortable: true,
  },
  {
    field: "teams",
    headerName: "Teams",
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      const teams = params.value || [];
      return Array.isArray(teams) ? teams.join(", ") : teams;
    },
  },
];

const Institutions = () => {
  const onSubmit = useCallback((ids) => mergeInstitutions(ids), []);

  const confirmMessage = (ids, rows) => {
    const name = (id) => rows.find((r) => r.id === id)?.name || `#${id}`;
    const [survivor, ...rest] = ids;
    if (rest.length === 0) {
      return `Submit "${name(survivor)}"?`;
    }
    return `Merge ${rest.map((id) => `"${name(id)}"`).join(", ")} (red) into "${name(survivor)}" (green)? This cannot be undone.`;
  };

  return (
    <MergeableEntityGrid
      fetchRows={getInstitutions}
      columns={columns}
      onSubmit={onSubmit}
      mode="submit"
      actionLabel="Submit Selected"
      loadingLabel="Loading Institutions..."
      confirmMessage={confirmMessage}
      successMessage="Institutions updated."
    />
  );
};

export default Institutions;
