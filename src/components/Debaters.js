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
        async () => {
            setLoading(true); // Set loading to true at the start
            try {
                const response = await fetch(`${API_URL}/teams-speaks-rounds`);
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
        searchDebaters(); // Initial fetch can be empty or set to default value
    }, [searchDebaters]);

    const handleMerge = async () => {
        if (selectedDebaters.length === 2) {
            try {
                setLoading(true);
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
                if (!response.ok) {
                    throw new Error(`Merge failed: ${response.status}`);
                }
                setSelectedDebaters([]);
                await searchDebaters();
            } catch (err) {
                console.error("Error merging debaters:", err);
                alert("Failed to merge debaters. Check console for details.");
            } finally {
                setLoading(false);
            }
        } else if (selectedDebaters.length === 1 || selectedDebaters.length === 0) {
            alert("Please select at least one debater.");
        } else {
            alert("Please select only two debaters to merge.");
        }
    };

    const getRowClassName = (params) => {
        if (selectedDebaters.length >= 1 && params.id === selectedDebaters[0]) {
            return 'old-debater-row';
        }
        if (selectedDebaters.length >= 2 && params.id === selectedDebaters[1]) {
            return 'new-debater-row';
        }
        return '';
    };

    return (
        <div>
            <style>{`
                .old-debater-row {
                    background-color: #ffcdd2 !important;
                }
                .new-debater-row {
                    background-color: #c8e6c9 !important;
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
                        setSelectedDebaters(selection);
                    }}
                    getRowClassName={getRowClassName}
                    rows={debaters}
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
                            flex: 0.3,
                            sortable: true,
                        },
                        {
                            field: "fullName",
                            headerName: "Full Name",
                            flex: 0.5,
                            sortable: true,
                        },
                        {
                            field: "teams",
                            headerName: "Team Names",
                            flex: 1,
                            sortable: true,
                        },
                        {
                            field: "averageScore",
                            headerName: "Average",
                            type: "number",
                            flex: 0.2,
                            sortable: false,
                        },
                        {
                            field: "roundsDebated",
                            headerName: "Rounds",
                            type: "number",
                            flex: 0.2,
                            sortable: false,
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
