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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Dashboard = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        background: "#1e1e2f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pt: 10,
        px: 2,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "white",
          fontWeight: "bold",
          letterSpacing: "8px",
          mb: 4,
        }}
      >
        TODO
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: "#25273c",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          mb: 2,
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
        />
        <IconButton sx={{ color: "#fff" }}>
          <AddIcon />
        </IconButton>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: "#25273c",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "10px",
        }}
      >
        <List>
          <ListItem
            sx={{ color: "#fff", borderBottom: "1px solid #444" }}
            secondaryAction={<span style={{ color: "red", fontSize: "1.2rem" }}>•</span>}
          >
            <ListItemIcon>
              <Checkbox sx={{ color: "#fff" }} />
            </ListItemIcon>
            <ListItemText primary="help" />
          </ListItem>
        </List>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            px: 1,
            color: "#aaa",
            fontSize: "0.9rem",
          }}
        >
          <span>1 item left</span>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="text" size="small" sx={{ color: "#aaa" }}>
              All
            </Button>
            <Button variant="text" size="small" sx={{ color: "#aaa" }}>
              Active
            </Button>
            <Button variant="text" size="small" sx={{ color: "#aaa" }}>
              Completed
            </Button>
          </Box>
          <Button variant="text" size="small" sx={{ color: "#aaa" }}>
            Clear Completed
          </Button>
        </Box>
      </Paper>

      <Typography
        variant="body2"
        sx={{ color: "#aaa", mt: 5, textAlign: "center" }}
      >
        Challenge by <a href="https://frontendmentor.io" style={{ color: "#aaa" }}>Frontend Mentor</a>. Coded by <a href="https://github.com/yourgithub" style={{ color: "#aaa" }}>You</a>.
      </Typography>
    </Box>
  );
};

export default Dashboard;
