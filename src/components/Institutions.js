import React, { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";

const Institutions = () => {
  const [institutions, setInstitution] = useState([]);
  const [, setLoading] = useState(true);
  const [selectedInstitutions, setSelectedInstitutions] = useState([]);

  const API_URL = `http://localhost:8080/api/v1/institution`;

  const searchInstitutions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL+`/teams-list`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }
      const data = await response.json();
      setInstitution(data);
      setSelectedInstitutions([]);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    searchInstitutions();
  }, [searchInstitutions]);

  const handleSubmit = async () => {
    if (selectedInstitutions.length < 1) {
      alert("Please select at least one institution.");
      return;
    }
    try {
      const response = await fetch(API_URL + "/replace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          institutionIds: selectedInstitutions,
        }),
      });
      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }
      setSelectedInstitutions([]);
      await searchInstitutions();
    } catch (err) {
      console.error("Error submitting institutions:", err);
    }
  };

  const getRowClassName = (params) => {
    if (selectedInstitutions.length >= 1 && params.id === selectedInstitutions[0]) {
      return 'primary-institution-row';
    }
    if (selectedInstitutions.includes(params.id) && params.id !== selectedInstitutions[0]) {
      return 'secondary-institution-row';
    }
    return '';
  };

  return (
    <div>
      <style>{`
        .primary-institution-row {
          background-color: #c8e6c9 !important;
        }
        .primary-institution-row .MuiDataGrid-cell {
          color: black !important;
        }
        .secondary-institution-row {
          background-color: #ffcdd2 !important;
        }
        .secondary-institution-row .MuiDataGrid-cell {
          color: black !important;
        }
      `}</style>
      <Paper
        sx={{
          maxWidth: "94vw",
          marginInline: "auto",
          marginBlock: "4vh",
          display: "flex",
          flexDirection: "column",
          maxHeight: "75vh",
        }}
      >
        <StyledDataGrid
          checkboxSelection={true}
          disableRowSelectionOnClick={true}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectedInstitutions(newSelectionModel);
          }}
          getRowClassName={getRowClassName}
          rows={institutions}
          columns={[
            {
              field: "id",
              headerName: "ID",
              flex: 0.1,
              sortable: true,
            },
            {
              field: "name",
              headerName: "Institution Name",
              flex: 0.4,
              sortable: true,
            },
            {
              field: "abbreviation",
              headerName: "Abbreviation",
              flex: 0.2,
              sortable: true,
            },
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
          ]}
        />
      </Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBlock: "2vh",
          marginInline: "auto",
          width: "25vw",
          position: "sticky",
          bottom: "5vh",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={selectedInstitutions.length === 0}
        >
          Submit Selected
        </Button>
      </Box>
    </div>
  );
};

export default Institutions;
