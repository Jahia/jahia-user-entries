import {registry} from '@jahia/ui-extender';
import registerProfiles from './Profile/Profile.routes';
import registerWorkflow from './Workflow/Workflow.routes';

export default function () {
    registry.add('callback', 'userentries', {
        targets: ['jahiaApp-init:5'],
        callback: () => {
            registerProfiles();
            registerWorkflow();
        }
    });
}
