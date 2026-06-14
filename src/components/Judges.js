import React, { useCallback } from "react";
import MergeableEntityGrid from "./common/MergeableEntityGrid";
import { getJudges, mergeJudges } from "../services/api";

const columns = [
  { field: "id", headerName: "ID", flex: 0.1, sortable: true },
  { field: "firstName", headerName: "First Name", flex: 0.2, sortable: true },
  { field: "lastName", headerName: "Last Name", flex: 0.2, sortable: true },
  {
    field: "breaks",
    headerName: "Breaks Judged",
    type: "number",
    flex: 0.1,
    sortable: false,
  },
  {
    field: "prelims",
    headerName: "Prelims Judged",
    type: "number",
    flex: 0.1,
    sortable: false,
  },
  {
    field: "tournaments",
    headerName: "Tournaments Judged",
    flex: 0.8,
    sortable: false,
    renderCell: (params) => {
      const tournaments = params.value || [];
      return Array.isArray(tournaments) ? tournaments.join(", ") : tournaments;
    },
  },
];

const fetchRows = async () => {
  const data = await getJudges();
  return data.map((item) => ({
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    breaks: item.breaks,
    prelims: item.prelims,
    tournaments: item.tournaments || [],
  }));
};

const Judges = () => {
  // selected[0] is merged into selected[1] (old -> new).
  const onSubmit = useCallback(([oldId, newId]) => mergeJudges(oldId, newId), []);

  const confirmMessage = ([oldId, newId], rows) => {
    const name = (id) => {
      const r = rows.find((row) => row.id === id);
      return r ? `${r.firstName} ${r.lastName}` : `#${id}`;
    };
    return `Merge "${name(oldId)}" (red) into "${name(newId)}" (green)? This cannot be undone.`;
  };

  return (
    <MergeableEntityGrid
      fetchRows={fetchRows}
      columns={columns}
      onSubmit={onSubmit}
      mode="merge"
      actionLabel="Merge Selected"
      loadingLabel="Loading Judges..."
      confirmMessage={confirmMessage}
      successMessage="Judges merged."
    />
  );
};

export default Judges;
