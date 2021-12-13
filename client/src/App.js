import { Fragment, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Grid, Paper, Switch, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import b64ToBlob from 'b64-to-blob';
import fileSaver from 'file-saver';

// main entry for application
function App() {
    const [downloading, setDownloading] = useState(false);
    const { handleSubmit, control } = useForm({
        defaultValues: {
            checkJson: false,
            checkDetailed: false,
        },
    });

    const onSubmit = ({ checkJson, checkDetailed }) => {
        setDownloading(true);
        fetch(`http://localhost:3001/postdata/${checkJson}/${checkDetailed}`)
            .then((response) => {
                return response.text();
            })
            .then((zipAsBase64) => {
                const blob = b64ToBlob(zipAsBase64, 'application/zip');
                fileSaver.saveAs(blob, 'posts.zip');
                setDownloading(false);
            });
    };

    const styleOverride = {
        color: '#73797d',
        backgroundColor: '#6FEBBE',
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1400 }}>
            <Paper style={styleOverride} elevation={3}>
                <Typography variant='h4' component='div' gutterBottom>
                    CafeMedia Coding Challenge - Key Houck
                </Typography>
            </Paper>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container direction='column' spacing={3}>
                    <Grid item xs={3}>
                        <Controller
                            name='checkJson'
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => (
                                <Fragment>
                                    <Typography>JSON Format</Typography>
                                    <Switch {...field} label='JSON Format'></Switch>
                                </Fragment>
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Controller
                            name='checkDetailed'
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => (
                                <Fragment>
                                    <Typography>Detail Mode</Typography>
                                    <Switch {...field} label='Detail Mode'></Switch>
                                </Fragment>
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button type='submit' variant='contained'>
                            <CheckIcon />
                            {downloading ? 'Downloading' : 'Download'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default App;
