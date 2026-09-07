import React from 'react';
import {useTranslation} from 'react-i18next';
import {Badge, PrimaryNavItem} from '@jahia/moonstone';
import Person from '@jahia/moonstone/dist/icons/Person';
import {useHistory} from 'react-router';
import ProfileConstants from './Profile.constants';
import LogoutButton from './LogoutButton';
import {useProfileNotifications} from './Notifications';

const ProfileItem = props => {
    const history = useHistory();
    const {t} = useTranslation('jahia-user-entries');
    // What contributed sources have to say (see Notifications.constants for the contract). The
    // panel itself is drawn by the provider, from the rectangle handed over on hover: this stays
    // a single PrimaryNavItem because PrimaryNavGroup clones it to attach the item's role and
    // registry data attributes.
    const {items, openPanel, closePanel} = useProfileNotifications();
    const hasNotifications = items.length > 0;

    return (
        <PrimaryNavItem {...props}
                        icon={<Person/>}
                        subtitle={`${window.contextJsParameters.user.fullname} (${window.contextJsParameters.user.email})`}
                        label={t('userEntries.profile.label')}
                        button={<LogoutButton/>}
                        /* Danger rather than accent: this counts things waiting to be looked at,
                           and the rail already spends accent on "where you are". */
                        badge={hasNotifications ? <Badge color="danger" label={String(items.length)}/> : undefined}
                        isSelected={history.location.pathname.startsWith(ProfileConstants.ROUTE)}
                        /* Focus opens it too: hover alone would put the list out of reach of
                           anybody navigating with a keyboard. */
                        onMouseEnter={hasNotifications ?
                            event => openPanel(event.currentTarget.getBoundingClientRect()) :
                            undefined}
                        onMouseLeave={hasNotifications ? closePanel : undefined}
                        onFocus={hasNotifications ?
                            event => openPanel(event.currentTarget.getBoundingClientRect()) :
                            undefined}
                        onBlur={hasNotifications ? closePanel : undefined}
                        onClick={() => history.push(ProfileConstants.ROUTE)}/>
    );
};

export default ProfileItem;
