import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { LineChart } from "@mui/x-charts/LineChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { getDebaters, getDebaterScores } from "../services/api";

const SpeakerGraphs = () => {
  const [allDebaters, setAllDebaters] = useState([]);
  const [selectedDebater, setSelectedDebater] = useState(null);
  const [counts, setCounts] = useState([]);
  const [tournamentScores, setTournamentScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all debaters on mount for the search box.
  useEffect(() => {
    const fetchDebaters = async () => {
      try {
        const data = await getDebaters();
        setAllDebaters(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDebaters();
  }, []);

  const fetchScores = async (debaterId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDebaterScores(debaterId);

      const counts = {};
      const _tournamentScores = [];

      data.tournamentRoundScores.forEach((tournament) => {
        tournament.roundScores.forEach((round, ind) => {
          // Defensive: tally whatever score comes back, even off the 70–80 grid.
          counts[round.score] = (counts[round.score] || 0) + 1;
          _tournamentScores.push({
            y: round.score,
            x: new Date(tournament.date),
            id: "T" + tournament.id + "-" + ind,
          });
        });
      });

      // Sort score keys numerically (not lexicographically) before plotting.
      const countsX = Object.keys(counts)
        .map(Number)
        .sort((a, b) => a - b);
      const countsY = countsX.map((key) => counts[key]);
      setCounts([countsX, countsY]);
      setTournamentScores(_tournamentScores);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDebater) {
      fetchScores(selectedDebater.id);
    }
  };

  return (
    <div>
      <Paper
        sx={{
          maxWidth: "96vw",
          marginInline: "auto",
          marginBlock: "3vh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          minHeight: "10vh",
          padding: "1vh",
        }}
      >
        <Typography variant="h6" component="h2">
          Speaker Performance
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", gap: "12px", alignItems: "center" }}
        >
          <Autocomplete
            options={allDebaters}
            value={selectedDebater}
            onChange={(_, value) => setSelectedDebater(value)}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Search speaker" size="small" />
            )}
          />
          <Button type="submit" variant="contained" disabled={!selectedDebater}>
            Fetch Scores
          </Button>
        </Box>
      </Paper>

      {error && (
        <Box sx={{ display: "flex", justifyContent: "center", marginBlock: "2vh" }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Paper
        sx={{
          maxWidth: "98vw",
          marginInline: "auto",
          marginBlock: "2vh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          height: "60vh",
        }}
      >
        {loading && <CircularProgress />}

        {!loading && tournamentScores.length > 0 && (
          <ScatterChart
            xAxis={[
              {
                label: "Tournament Dates",
                type: "utc",
                valueFormatter: (date) => {
                  const d = date instanceof Date ? date : new Date(date);
                  return d.toISOString().split("T")[0];
                },
              },
            ]}
            yAxis={[{ label: "Scores", min: 70, max: 80 }]}
            series={[{ data: tournamentScores }]}
            width={600}
            height={400}
          />
        )}

        {!loading && counts.length > 0 && (
          <LineChart
            xAxis={[{ data: counts[0], min: 70, max: 80, label: "Score" }]}
            series={[
              {
                data: counts[1],
                area: true,
                type: "line",
                connectNulls: true,
                showMark: false,
              },
            ]}
            yAxis={[{ label: "Scores", min: 0, max: Math.max(...counts[1]) + 2 }]}
            height={400}
            width={600}
          />
        )}

        {!loading && tournamentScores.length === 0 && (
          <Typography color="text.secondary">
            Search for a speaker and fetch scores to see their performance.
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default SpeakerGraphs;
