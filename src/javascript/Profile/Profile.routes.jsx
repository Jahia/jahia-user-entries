import React from 'react';
import {registry, IframeRenderer} from '@jahia/ui-extender';
import Person from '@jahia/moonstone/dist/icons/Person';
import ProfileConstants from './Profile.constants';
import ProfileItem from './ProfileItem';
import ProfileLayout from './ProfileLayout';

export default function () {
    registry.add('primary-nav-item', 'profile', {
        targets: ['nav-root-profile:1'],
        render: () => <ProfileItem/>
    });

    // /profile* rather than /profile: this route is now a container for everything contributed to
    // the `profile` adminRoute target, so it has to match those entries' own paths too.
    registry.add('route', 'profile', {
        targets: ['main'],
        path: `${ProfileConstants.ROUTE}*`,
        defaultPath: ProfileConstants.ROUTE,
        render: v => <ProfileLayout match={v.match}/>
    });

    // The profile page itself, as the first entry of its own section -- clicking the icon shows
    // your profile, with the rest of what is yours beside it. It names an explicit `route` so the
    // bare /profile address selects it, the way the dashboard's home entry does for /dashboard.
    registry.add('adminRoute', 'profile-me', {
        targets: ['profile:10'],
        icon: <Person/>,
        label: 'jahia-user-entries:userEntries.profile.label',
        isSelectable: true,
        route: ProfileConstants.ROUTE,
        render: () => (
            <IframeRenderer
                url={`${window.contextJsParameters.contextPath}/cms/dashboardframe/default/$lang/${window.contextJsParameters.currentUserPath}.me.html?redirect=false`}/>
        )
    });
}
