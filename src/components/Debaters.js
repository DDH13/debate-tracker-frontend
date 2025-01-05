import React, {useCallback, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import StyledDataGrid from "../utils/styledDataGrid";

const Debaters = () => {
    const [debaters, setDebaters] = useState([]);
    const [, setLoading] = useState(true);
    const [selectedDebaters, setSelectedDebaters] = useState([]);

    const API_URL = `http://localhost:8080/api/v1/debater`;
    // const API_URL = `${process.env.REACT_APP_API_BASE_URL}/debater`;

    // Function to fetch debaters based on the search term
    const searchDebaters = useCallback(
        async (name) => {
            setLoading(true); // Set loading to true at the start
            try {
                const response = await fetch(`${API_URL}?search=${name}`);
                if (!response.ok) {
                    const errorText = await response.text(); // Read error response as text
                    throw new Error(
                        `HTTP error! Status: ${response.status}, Body: ${errorText}`
                    );
                }
                const data = await response.json();
                setDebaters(data);
                setSelectedDebaters([]); // Clear selected debaters after fetching new data
            } catch (err) {
                console.error("Error fetching debaters:", err);
            } finally {
                setLoading(false);
            }
        },
        [API_URL]
    );

    // Initial fetch for all debaters when the component mounts
    useEffect(() => {
        searchDebaters(""); // Initial fetch can be empty or set to default value
    }, [searchDebaters]);

  const handleMerge = async () => {
    if (selectedDebaters.length === 2) {
      // Call API to merge selected debaters
      console.log("Selected Debaters:", selectedDebaters);
      // Implement API call for merging debaters here
      const response = await fetch(API_URL + "/replace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldDebaterId: selectedDebaters[0],
          newDebaterId: selectedDebaters[1],
        }),
      });
      const result = await response.json();
      console.log(`Merge Result: ${result.message}`);

      setSelectedDebaters([]); // Reset selection after merging
      await searchDebaters(); // Refresh the list
    } else if (selectedDebaters.length === 1 || selectedDebaters.length === 0) {
      alert("Please select at least one debater.");
    } else {
      alert("Please select only two debaters to merge.");
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
          onRowSelectionModelChange={(selection) => {
            setSelectedDebaters(selection);
          }}
          rows={debaters}
          columns={[
            {
              field: "firstName",
              headerName: "First Name",
              flex: 0.5,
              sortable: true,
            },
            {
              field: "lastName",
              headerName: "Last Name",
              flex: 0.5,
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
          disabled={selectedDebaters.length === 0}
        >
          Merge Selected
        </Button>
      </Box>
    </div>
  );
};

export default Debaters;
