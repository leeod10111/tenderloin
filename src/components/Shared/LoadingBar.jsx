import { CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const styles = {
    loadingProgressBox:{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}

export const LoadingBar = ({ loadingProgress }) => {
    return (
        <Grid container spacing={3} alignContent={"center"} justifyContent="center" alignItems={"center"}>
            <Grid item xs={12}>
                <Box display={"flex"} justifyContent="center" position="relative">
                    <CircularProgress
                        variant="determinate"
                        value={loadingProgress}
                        color="info"
                        size={"4rem"}
                    />
                    <Box
                        sx={styles.loadingProgressBox}
                    >
                        <Typography variant="caption" component="div" color="white">
                            {`${Math.round(loadingProgress)}%`}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Typography color="wheat" textAlign={"center"}>
                    Loading loops...
                </Typography>
            </Grid>
        </Grid>
    );
};
