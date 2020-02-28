import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button, PrimaryNavItem} from '@jahia/moonstone';
import Power from '@jahia/moonstone/dist/icons/Power';
import Person from '@jahia/moonstone/dist/icons/Person';
import {registry} from '@jahia/ui-extender';
import {useHistory} from 'react-router';
import Profile from './Profile';

const ROUTE = '/profile';

export const ProfileGroup = () => {
    const history = useHistory();
    const {t} = useTranslation('jahia-user-entries');
    let button = (
        <Button isReversed
                icon={<Power/>}
                variant="ghost"
                label={t('userEntries.profile.signOut')}
                onClick={() => {
                    let url = window.contextJsParameters.contextPath + '/cms/logout?redirect=' + window.contextJsParameters.contextPath + '/start';
                    window.location.assign(url);
                }}/>
    );
    return (
        <PrimaryNavItem icon={<Person/>}
                        subtitle={`${window.contextJsParameters.user.fullname} (${window.contextJsParameters.user.email})`}
                        label={t('userEntries.profile.label')}
                        button={button}
                        isSelected={history.location.pathname.startsWith(ROUTE)}
                        onClick={() => history.push(ROUTE)}/>
    );
};

registry.add('primary-nav-item', 'bottomProfileNavGroup', {
    targets: ['nav-root-profile:1'],
    render: () => <ProfileGroup/>
});

registry.add('route', 'profile', {
    targets: ['nav-root-top'],
    path: ROUTE,
    defaultPath: ROUTE,
    render: () => <Profile/>
});
