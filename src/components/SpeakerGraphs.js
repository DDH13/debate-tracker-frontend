import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { LineChart } from "@mui/x-charts/LineChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";

const SpeakerGraphs = () => {
  const [allDebaters, setAllDebaters] = useState([]); // Stores all debaters for autofill
  const [filteredDebaters, setFilteredDebaters] = useState([]); // Stores filtered debaters for search suggestions
  const [selectedDebaterId, setSelectedDebaterId] = useState(null);
  const [counts, setCounts] = useState([]); // Stores the counts for y-axis
  const [tournamentScores, setTournamentScores] = useState([]);
  const [minMaxTD, setMinMaxTD] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search input value

  const DEBATERS_API_URL = `http://localhost:8080/api/v1/debater`;
  const SCORES_API_URL = `http://localhost:8080/api/v1/debater/speaks/`; // Use ID to fetch data

  // Fetch all debaters on component mount
  useEffect(() => {
    const fetchDebaters = async () => {
      try {
        const response = await fetch(DEBATERS_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAllDebaters(data);
      } catch (err) {
        console.error("Error fetching debaters:", err);
      }
    };
    fetchDebaters();
  }, []);

  // Filter debaters based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allDebaters.filter((debater) =>
        `${debater.firstName} ${debater.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredDebaters(filtered);
    } else {
      setFilteredDebaters([]);
      setSelectedDebaterId(null); // Clear the selected ID when the search is cleared
    }
  }, [searchQuery, allDebaters]);

  // Fetch scores for the selected debater
  const fetchScores = async (debaterId) => {
    setLoading(true);
    try {
      const response = await fetch(`${SCORES_API_URL}${debaterId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const scoresData = [];
      const counts = {};
      for (let i = 70; i <= 80; i += 0.5) {
        counts[i] = 0;
      }
      const _tournamentScores = [];
      let minMaxTD = [null, null];

      data.tournamentRoundScores.forEach((tournament) => {
        if (minMaxTD[0] === null || tournament.date < minMaxTD[0]) {
          minMaxTD[0] = tournament.date;
        }
        if (minMaxTD[1] === null || tournament.date > minMaxTD[1]) {
          minMaxTD[1] = tournament.date;
        }
        tournament.roundScores.forEach((round, ind) => {
          counts[round.score] += 1;
          _tournamentScores.push({
            y: round.score,
            x: new Date(tournament.date),
            id: "T" + tournament.id + "-" + ind,
          });
        });
      });

      let countsX = Object.keys(counts).sort();
      let countsY = countsX.map((key) => counts[key]);
      setCounts([countsX, countsY]);
      setTournamentScores(_tournamentScores);
      setMinMaxTD(minMaxTD);

    } catch (err) {
      console.error("Error fetching scores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDebaterId) {
      fetchScores(selectedDebaterId);
    } else {
      console.error("No debater selected");
    }
  };

  // Set debater ID based on the typed or selected name
  const handleDebaterSelection = (e) => {
    const name = e.target.value;
    setSearchQuery(name);

    const selectedDebater = allDebaters.find(
      (debater) => `${debater.firstName} ${debater.lastName}` === name
    );
    if (selectedDebater) {
      setSelectedDebaterId(selectedDebater.id);
    } else {
      setSelectedDebaterId(null); // Clear if no exact match
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
          height: "10vh",
        }}
      >
        <h2>Speaker Performance</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter speaker's name"
            value={searchQuery}
            onChange={handleDebaterSelection} // Handles both search and ID setting
            list="debater-list" // Enable autofill with suggestions
          />
          <datalist id="debater-list">
            {filteredDebaters.map((debater) => (
              <option
                key={debater.id}
                value={`${debater.firstName} ${debater.lastName}`}
              />
            ))}
          </datalist>
          <button type="submit">Fetch Scores</button>
        </form>
      </Paper>

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
        {loading && <p>Loading scores...</p>}

        {tournamentScores.length > 0 && (
          <ScatterChart
            xAxis={[
              {
                label: "Tournament Dates",
                type: "utc",
                valueFormatter: (date) => {
                  if (date instanceof Date) {
                    return date.toISOString().split("T")[0];
                  } else {
                    let newDate = new Date(date);
                    return newDate.toISOString().split("T")[0];
                  }
                },
              },
            ]}
            yAxis={[
              {
                label: "Scores",
                min: 70,
                max: 80,
              },
            ]}
            series={[
              {
                data: tournamentScores,
              },
            ]}
            width={600}
            height={400}
          />
        )}

        {counts.length > 0 && (
          <LineChart
            xAxis={[{ data: counts[0], min: 70, max: 80, label: "Score" }]}
            series={[
              {
                data: counts[1],
                area: true,
                type: "line",
                // curve: "monotoneX",
                connectNulls: true,
                // label: "Count",
                showMark: false,
              },
            ]}
            yAxis={[
              {
                label: "Scores",
                min: 0,
                max: Math.max(...counts[1]) + 2,
              },
            ]}
            height={400}
            width={600}
          />
        )}
      </Paper>
    </div>
  );
};

export default SpeakerGraphs;
