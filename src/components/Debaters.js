import React, { useCallback } from "react";
import MergeableEntityGrid from "./common/MergeableEntityGrid";
import { getDebatersWithStats, mergeDebaters } from "../services/api";

const columns = [
  { field: "id", headerName: "ID", flex: 0.1, sortable: true },
  { field: "firstName", headerName: "First Name", flex: 0.2, sortable: true },
  { field: "lastName", headerName: "Last Name", flex: 0.3, sortable: true },
  { field: "fullName", headerName: "Full Name", flex: 0.5, sortable: true },
  { field: "teams", headerName: "Team Names", flex: 1, sortable: true },
  {
    field: "roundsDebated",
    headerName: "Rounds",
    type: "number",
    flex: 0.2,
    sortable: false,
  },
];

const Debaters = () => {
  // selected[0] is merged into selected[1] (old -> new).
  const onSubmit = useCallback(
    ([oldId, newId]) => mergeDebaters(oldId, newId),
    []
  );

  const confirmMessage = ([oldId, newId], rows) => {
    const name = (id) => rows.find((r) => r.id === id)?.fullName || `#${id}`;
    return `Merge "${name(oldId)}" (red) into "${name(newId)}" (green)? This cannot be undone.`;
  };

  return (
    <MergeableEntityGrid
      fetchRows={getDebatersWithStats}
      columns={columns}
      onSubmit={onSubmit}
      mode="merge"
      actionLabel="Merge Selected"
      loadingLabel="Loading Debaters..."
      confirmMessage={confirmMessage}
      successMessage="Debaters merged."
    />
  );
};

export default Debaters;
