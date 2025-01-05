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
      const response = await fetch(API_URL);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorText}`
        );
      }
      const data = await response.json();
      setInstitution(data);
      setSelectedInstitutions([]); // Clear selected institutions after fetching new data
    } catch (err) {
      console.error("Error fetching institutions:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    searchInstitutions();
  }, [searchInstitutions]);

  const handleMerge = async () => {
    if (selectedInstitutions.length > 0) {
      console.log("Selected Institutions:", selectedInstitutions);
      const response = await fetch(API_URL + "/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ institutionIds: selectedInstitutions }),
      });
      const result = await response.json();
      console.log(`Merge Result: ${result.message}`);
      setSelectedInstitutions([]);
      await searchInstitutions();
    } else {
      alert("Please select at least one institution.");
    }
  };

  return (
    <div>
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
          rows={institutions}
          columns={[
            {
              field: "id",
              headerName: "ID",
              width: 100,
              sortable: false,
            },
            {
              field: "name",
              headerName: "Institution Name",
              flex: 1,
              sortable: true,
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
          onClick={handleMerge}
          disabled={selectedInstitutions.length === 0}
        >
          Merge Selected
        </Button>
      </Box>
    </div>
  );
};

export default Institutions;
