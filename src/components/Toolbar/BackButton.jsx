import { ArrowBackIos } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useHistory } from 'react-router-dom';

export const BackButton = () => {
    const history = useHistory();

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <IconButton
            size="small"
            onClick={handleGoBack}
        >
            <ArrowBackIos htmlColor="wheat" />
        </IconButton>
    );
};
