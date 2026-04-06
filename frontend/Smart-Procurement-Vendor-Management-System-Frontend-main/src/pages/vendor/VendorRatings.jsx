import { useEffect, useState } from "react";
import { getVendorRatings, getVendorAverageRating } from "../../api/vendorService";

import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Container, Grid
} from "@mui/material";

import StarIcon from '@mui/icons-material/Star';

export default function VendorRatings() {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);
  const vendorId = localStorage.getItem("vendorId") || 1; 

  useEffect(() => {
    const loadAllRatings = async () => {
      try {
        const ratingsRes = await getVendorRatings(vendorId);
        const allRatings = ratingsRes.data || [];
        setRatings(allRatings);
      } catch (err) {
        console.error("Error loading ratings:", err);
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }
        setRatings([]);
      }
    };

    loadAllRatings();

    getVendorAverageRating(vendorId)
      .then((res) => setAverage(res.data?.averageScore ?? null))
      .catch((err) => {
        console.error("Error loading average rating:", err);
        setAverage(null);
      });
  }, [vendorId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <StarIcon sx={{ fontSize: 40, color: "#fbc02d" }} />
          Vendor Ratings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your performance and compliance scores
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: "10px", border: "1px solid #e0e0e0" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Average Score
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {average !== null ? average.toFixed(2) : "--"}
            </Typography>
          </Paper>
        </Grid>
        {/* <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: "10px", border: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle2" color="text.secondary">Total Ratings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{ratings.length}</Typography>
          </Paper>
        </Grid> */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: "10px", border: "1px solid #e0e0e0" }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Admin Ratings
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {ratings.filter((r) => r.adminRating).length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#fafafa" }}>
            <TableRow sx={{ bgcolor: "#1976d2" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                QUALITY
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                DELIVERY
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                PRICE
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                RATER
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fafafa" }}>
                REMARKS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratings.length > 0 ? (
              ratings.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {r.qualityScore} / 10
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {r.deliveryScore} / 10
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {r.priceScore} / 10
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {r.ratedBy?.role?.roleName}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {r.comments}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  No Ratings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}