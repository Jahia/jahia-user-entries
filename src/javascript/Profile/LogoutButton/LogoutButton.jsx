import React from 'react';
import {Button} from '@jahia/moonstone';
import Power from '@jahia/moonstone/dist/icons/Power';
import {useTranslation} from 'react-i18next';

const LogoutButton = () => {
    const {t} = useTranslation('jahia-user-entries');

    return (
        <Button isReversed
                icon={<Power/>}
                variant="ghost"
                label={t('userEntries.profile.signOut')}
                onClick={() => {
                    let url = window.contextJsParameters.contextPath + '/cms/logout?redirect=' + window.contextJsParameters.contextPath + '/start';
                    window.location.assign(url);
                }}/>
    );
};

export default LogoutButton;
