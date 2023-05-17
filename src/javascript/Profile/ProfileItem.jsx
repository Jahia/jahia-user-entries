import React from 'react';
import {useTranslation} from 'react-i18next';
import {PrimaryNavItem} from '@jahia/moonstone';
import Person from '@jahia/moonstone/dist/icons/Person';
import {useHistory} from 'react-router';
import ProfileConstants from './Profile.constants';
import LogoutButton from './LogoutButton';

const ProfileItem = props => {
    const history = useHistory();
    const {t} = useTranslation('jahia-user-entries');

    return (
        <PrimaryNavItem {...props}
                        icon={<Person/>}
                        subtitle={`${window.contextJsParameters.user.fullname} (${window.contextJsParameters.user.email})`}
                        label={t('userEntries.profile.label')}
                        button={<LogoutButton/>}
                        isSelected={history.location.pathname.startsWith(ProfileConstants.ROUTE)}
                        onClick={() => history.push(ProfileConstants.ROUTE)}/>
    );
};

export default ProfileItem;
