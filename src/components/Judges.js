import React, {useCallback, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";

const JudgeRounds = () => {
  const [judges, setJudges] = useState([]);
  const [, setLoading] = useState(true);
  const [selectedJudges, setSelectedJudges] = useState([]);

  const API_URL = `http://localhost:8080/api/v1/judge`;

  const fetchJudges = useCallback(
    async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL+`/prelims-breaks-tournaments`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setJudges(data.map((item) => ({
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          breaks: item.breaks,
          prelims: item.prelims,
          tournaments: item.tournaments || [],
        })));
        setSelectedJudges([]);
      } catch (err) {
        console.error("Error fetching judges:", err);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    fetchJudges();
  }, [fetchJudges]);

  const handleMerge = async () => {
    if (selectedJudges.length === 2) {
      try {
        const response = await fetch(API_URL + "/replace", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldJudgeId: selectedJudges[0],
            newJudgeId: selectedJudges[1],
          }),
        });
        if (!response.ok) {
          throw new Error(`Merge failed: ${response.status}`);
        }
        setSelectedJudges([]);
        await fetchJudges();
      } catch (err) {
        console.error("Error merging judges:", err);
        alert("Failed to merge judges. Check console for details.");
      }
    } else if (selectedJudges.length === 1 || selectedJudges.length === 0) {
      alert("Please select at least two judges.");
    } else {
      alert("Please select only two judges to merge.");
    }
  };

  const getRowClassName = (params) => {
    if (selectedJudges.length >= 1 && params.id === selectedJudges[0]) {
      return 'old-judge-row';
    }
    if (selectedJudges.length >= 2 && params.id === selectedJudges[1]) {
      return 'new-judge-row';
    }
    return '';
  };

  return (
      <div>
        <style>{`
          .old-judge-row {
            background-color: #ffcdd2 !important;
          }
          .old-judge-row .MuiDataGrid-cell {
            color: black !important;
          }
          .new-judge-row {
            background-color: #c8e6c9 !important;
          }
          .new-judge-row .MuiDataGrid-cell {
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
              onRowSelectionModelChange={(selection) => {
                setSelectedJudges(selection);
              }}
              getRowClassName={getRowClassName}
              rows={judges}
              columns={[
                {
                  field: "id",
                  headerName: "ID",
                  flex: 0.1,
                  sortable: true,
                },
                {
                  field: "firstName",
                  headerName: "First Name",
                  flex: 0.2,
                  sortable: true,
                },
                {
                  field: "lastName",
                  headerName: "Last Name",
                  flex: 0.2,
                  sortable: true,
                },
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
              disabled={selectedJudges.length === 0}
          >
            Merge Selected
          </Button>
        </Box>
      </div>
  );
};

export default JudgeRounds;
