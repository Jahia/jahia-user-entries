import React from 'react';
import {registry} from '@jahia/ui-extender';
import registerProfiles from './Profile/Profile.routes';
import registerWorkflow from './Workflow/Workflow.routes';
import {ProfileNotificationsProvider} from './Profile/Notifications';

export default function () {
    // Outside the navigation and above it, so contributed notification sources stay mounted
    // wherever the reader is in the app -- the count on the profile icon has to exist before
    // anybody hovers it, not once they do. Priority 97 puts this outside jahia-ui-root's own
    // 'jahia' entry (root:99), which renders the navigation that consumes the context.
    registry.add('app', 'profile-notifications', {
        targets: ['root:97'],
        render: next => <ProfileNotificationsProvider>{next}</ProfileNotificationsProvider>
    });

    registry.add('callback', 'userentries', {
        targets: ['jahiaApp-init:5'],
        callback: () => {
            registerProfiles();
            registerWorkflow();
        }
    });
}
