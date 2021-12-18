import { Button, createStyles, FormGroup, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Close';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { ButtonContainer } from '../../shared/ButtonContainer';
import { CheckboxField } from '../../shared/CheckboxField';
import Help from '../../shared/Help';
import LanguageSelector from '../../shared/LanguageSelect';
import Prompt from '../../shared/Prompt';
import { TextField } from '../../shared/TextField';
import EditUnavailability from './EditUnavailability';
import {ManageAddons} from './ManageAddons';
import { UnitUiStore } from './UnitUiStore';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            '& .MuiTextField-root': {
                marginBottom: theme.spacing(1)
            }
        },
        form: {
            marginTop: theme.spacing(2)
        },
        content: {
            flex: '1 0 auto',
        },
    }));

type Props = {
    vm: UnitUiStore
}

export const CreateUnitForm = observer(({ vm }: Props) => {
    const { t } = useTranslation(['app', 'common', 'validation']);
    const { goBack } = useHistory();
    return (<form onSubmit={(e) => vm.submit(e)}>
        <Grid container spacing={2}>
            <Grid item xs={12} container justify="flex-end">
                <Grid item>
                    <LanguageSelector local language={vm.language} onSelect={lang => vm.language = lang} />
                </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormGroup>
                    <TextField name="name"
                        label={t('app:CreateUnit.nameLabel')}
                        required
                        onChange={(val) => vm.name = val}
                        value={vm.name} />

                    <TextField name="description"
                        label={t('app:CreateUnit.descriptionLabel')}
                        multiline
                        required
                        onChange={val => vm.description = val}
                        value={vm.description} />

                    <CheckboxField name="isAddon"
                        label={<Typography>
                            {t('app:CreateUnit.isAddonLabel')}
                            <Help title={t('app:CreateUnit.isAddonLabelHelp')} />
                        </Typography>
                        }
                        onChange={(_, checked) => vm.isAddon = checked}
                        checked={vm.isAddon} />
                </FormGroup>
            </Grid>
            {vm.isEdit &&
                <Grid item xs={12} md={6}>
                    <ManageAddons store={vm} />
                    <EditUnavailability />
                </Grid>
            }

            <Grid item xs={12}>
                <ButtonContainer>
                    <Button type="submit" variant="contained" color="primary" >
                        {vm.isEdit ? t('common:button.save') : t('common:button.create')}
                    </Button>
                    {vm.isEdit &&
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteIcon />}
                            onClick={() => vm.promptDelete = true} >
                            {t('common:button.delete')}
                        </Button>
                    }
                    <Button
                        startIcon={<CancelIcon />}
                        onClick={goBack}>
                        {t('common:button.cancel')}
                    </Button>
                    <Prompt
                        open={vm.promptDelete}
                        onClose={() => vm.promptDelete = false}
                        onAccept={() => vm.delete()}
                        header={t('common:prompt.header')}
                        message={t('app:editUnit.verifyDeletion')} />
                </ButtonContainer>
            </Grid>

        </Grid>
    </form>);
});
