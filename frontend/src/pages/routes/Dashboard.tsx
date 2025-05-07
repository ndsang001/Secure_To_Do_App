import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from "react";
import { useTodoStore } from "../../store/useTodoStore";
import { Link } from "react-router-dom";
import logo from "../../assets/freemind_logo.png";

const Dashboard = () => {
  const [input, setInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const {
    todos,
    addTodo,
    toggleTodo,
    clearCompleted,
    setFilter,
    filter,
    fetchTodosFromAPI,
    loading,
    error,
  } = useTodoStore();

  useEffect(() => {
    fetchTodosFromAPI();
  }, [fetchTodosFromAPI]);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleAddTodo = () => {
    if (input.trim()) {
      addTodo(input.trim());
      setInput("");
      showSnackbar("Todo added successfully!");
    }
  };

  const handleToggle = async (id: number) => {
    await toggleTodo(id);
    showSnackbar("Todo updated!");
  };

  const handleClearCompleted = async () => {
    await clearCompleted();
    showSnackbar("Completed todos cleared!");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#1e1e2f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 6,
        boxSizing: "border-box",
      }}
    >
      {/* Logout Button */}
      <Box sx={{ position: "absolute", top: 20, right: 30 }}>
        <Button
          variant="outlined"
          color="error"
          component={Link}
          to="/logout"
          startIcon={<LogoutIcon />}
          sx={{
            color: "#fff",
            borderColor: "#fff",
            minWidth: 0,
            "&:hover": { borderColor: "#f00", color: "#f00" },
            display: {
              xs: "none",  // hide on extra-small
              sm: "none",  // hide on small
              md: "flex",  // show on medium+
            },
          }}
        >
          Logout
        </Button>

        {/* Icon-only version for small screens */}
        <IconButton
          component={Link}
          to="/logout"
          sx={{
            color: "#fff",
            display: {
              xs: "inline-flex", // show icon only on xs & sm
              sm: "inline-flex",
              md: "none",         // hide on medium+
            },
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Box>

      {/* Logo */}
      <Box mb={2} sx={{ position: "absolute", top: 20, left: 30 }}>
          <img src={logo} alt="App Logo" style={{ height: "60px" }} />
      </Box>

      <Typography
        variant="h3"
        sx={{
          color: "white",
          fontWeight: "bold",
          letterSpacing: "8px",
          mb: 4,
          fontSize: { xs: "2rem", md: "3rem" },
        }}
      >
        TODO
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          px: 3,
          boxSizing: "border-box",
        }}
      >
        {/* Input Box */}
        <Paper
          elevation={4}
          sx={{
            p: 2,
            backgroundColor: "#25273c",
            display: "flex",
            alignItems: "center",
            borderRadius: "10px",
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            placeholder="Create a new todo"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: { color: "#fff", ml: 1 },
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          />
          <IconButton onClick={handleAddTodo} sx={{ color: "#fff" }}>
            <AddIcon />
          </IconButton>
        </Paper>

        {/* Loading/Error */}
        {loading && (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <CircularProgress color="inherit" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Todos List */}
        {!loading && (
          <Paper
            elevation={4}
            sx={{
              p: 2,
              backgroundColor: "#25273c",
              borderRadius: "10px",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <List disablePadding>
              {filteredTodos.map((todo) => (
                <ListItem
                  key={todo.id}
                  sx={{
                    color: "#fff",
                    borderBottom: "1px solid #444",
                    cursor: "pointer",
                  }}
                  secondaryAction={
                    todo.completed && (
                      <span style={{ color: "red", fontSize: "1.2rem" }}>•</span>
                    )
                  }
                  onClick={() => todo.id && handleToggle(todo.id)}
                >
                  <ListItemIcon>
                    <Checkbox checked={todo.completed} sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={todo.text}
                    secondary={
                      todo.createdAt
                        ? new Date(todo.createdAt).toLocaleString()
                        : undefined
                    }
                    sx={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {filteredTodos.length === 0 && !loading && !error && (
              <Typography sx={{ color: "#aaa", textAlign: "center", mt: 2 }}>
                Your todo list is empty — start by adding a task!
              </Typography>
            )}

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                px: 1,
                color: "#aaa",
                fontSize: "0.9rem",
                flexWrap: "wrap",
                rowGap: 1,
              }}
            >
              <span>{todos.filter((t) => !t.completed).length} item(s) left</span>
              <Box sx={{ display: "flex", gap: 2 }}>
                {["all", "active", "completed"].map((f) => (
                  <Button
                    key={f}
                    variant="text"
                    size="small"
                    sx={{ color: filter === f ? "#fff" : "#aaa" }}
                    onClick={() => setFilter(f as "all" | "active" | "completed")}
                  >
                    {f[0].toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </Box>
              <Button
                variant="text"
                size="small"
                sx={{ color: "#aaa" }}
                onClick={handleClearCompleted}
              >
                Clear Completed
              </Button>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Typography
        variant="body2"
        sx={{ color: "#aaa", mt: "auto", mb: 2, textAlign: "center" }}
      >
        Challenge by{" "}
        <a href="https://frontendmentor.io" style={{ color: "#aaa" }}>
          Frontend Mentor
        </a>
        . Coded by{" "}
        <a href="https://github.com/yourgithub" style={{ color: "#aaa" }}>
          You
        </a>
        .
      </Typography>
    </Box>
  );
};

export default Dashboard;
