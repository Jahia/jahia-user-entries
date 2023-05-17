import React from 'react';
import {registry, IframeRenderer} from '@jahia/ui-extender';
import ProfileConstants from './Profile.constants';
import ProfileItem from './ProfileItem';

export default function () {
    registry.add('primary-nav-item', 'profile', {
        targets: ['nav-root-profile:1'],
        render: () => <ProfileItem/>
    });

    registry.add('route', 'profile', {
        targets: ['main'],
        path: ProfileConstants.ROUTE,
        defaultPath: ProfileConstants.ROUTE,
        render: () => (
            <IframeRenderer
            url={`${window.contextJsParameters.contextPath}/cms/dashboardframe/default/$lang/${window.contextJsParameters.currentUserPath}.me.html?redirect=false`}/>
        )
    });
}
