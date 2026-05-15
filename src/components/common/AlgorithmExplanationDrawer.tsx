"use client";

import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { AlgorithmInfo } from "@/lib/algorithmInfo";

type Props = {
  open: boolean;
  onClose: () => void;
  info: AlgorithmInfo;
};

export default function AlgorithmExplanationDrawer({ open, onClose, info }: Props) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 330, sm: 460 }, p: 3 }} role="presentation">
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
              Explanation
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {info.name}
            </Typography>
          </Box>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Stack>

        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {info.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          How it works
        </Typography>
        <Typography sx={{ mb: 3, lineHeight: 1.75 }} color="text.secondary">
          {info.howItWorks ?? info.description}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Pseudocode
        </Typography>
        <Paper
          component="pre"
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "background.default",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            fontSize: 13,
            lineHeight: 1.7,
            fontFamily: "monospace",
          }}
        >
          {info.pseudocode ?? "Select an algorithm to see pseudocode."}
        </Paper>

        <Typography variant="h6" sx={{ fontWeight: 800, mt: 3, mb: 1 }}>
          Complexities
        </Typography>
        <Stack sx={{ flexDirection: "row", gap: 1, flexWrap: "wrap" }}>
          <Chip label={`Time: ${info.time}`} color="primary" variant="outlined" />
          <Chip label={`Space: ${info.space}`} color="primary" variant="outlined" />
          {info.stable && <Chip label={`Stable: ${info.stable}`} />}
          {info.optimal && <Chip label={`Optimal: ${info.optimal}`} />}
          {info.recursive && <Chip label={`Recursive: ${info.recursive}`} />}
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 800, mt: 3, mb: 1 }}>
          Use cases
        </Typography>
        <Box component="ul" sx={{ pl: 3, mt: 0 }}>
          {(info.useCases ?? ["Learning and comparing algorithm behavior visually."]).map((item) => (
            <Typography component="li" key={item} sx={{ mb: 0.75 }} color="text.secondary">
              {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}
