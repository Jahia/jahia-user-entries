import React from 'react';
import {registry} from '@jahia/ui-extender';
import {useHistory} from 'react-router-dom';
import {Badge, PrimaryNavItem} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {useSubscription} from '@apollo/react-hooks';
import TaskIcon from '@jahia/moonstone/dist/icons/Task';
import Workflow from './Workflow';
import {NumberOfWorkflowsSubscription} from './Workflow.gql-queries';

export default function () {
    const PATH = '/workflow';

    const WorkflowGroup = () => {
        const {t} = useTranslation('jahia-user-entries');
        const history = useHistory();
        const {data} = useSubscription(NumberOfWorkflowsSubscription);

        const badge = data && data.workflowEvent.activeWorkflowTaskCountForUser > 0 ? (
            <Badge
                type="round"
                color="danger"
                label={data.workflowEvent.activeWorkflowTaskCountForUser}
            />
        ) : null;

        return (
            <PrimaryNavItem
                role="workflow-menu-item"
                badge={badge}
                isSelected={history.location.pathname.startsWith(PATH)}
                icon={<TaskIcon/>}
                label={t('userEntries.workflow.label')}
                onClick={() => history.push(PATH)}/>
        );
    };

    registry.add('primary-nav-item', 'workflowNavGroup', {
        targets: ['nav-root-tasks:2'],
        requiredPermission: 'workflow-dashboard-access',
        render: () => <WorkflowGroup key="workflowGroup"/>
    });

    // Register workflow component
    registry.add('route', 'workflow', {
        targets: ['main'],
        path: PATH,
        defaultPath: PATH,
        requiredPermission: 'workflow-dashboard-access',
        render: () => <Workflow/>
    });
}
