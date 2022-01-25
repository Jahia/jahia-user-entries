import React from 'react';
import {registry, IframeRenderer} from '@jahia/ui-extender';
import ProfileConstants from './Profile.constants';
import Profile from './Profile';

export default function () {
    registry.add('primary-nav-item', 'bottomProfileNavGroup', {
        targets: ['nav-root-profile:1'],
        render: () => <Profile/>
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
