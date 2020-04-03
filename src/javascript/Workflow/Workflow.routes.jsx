import React from 'react';
import {registry} from '@jahia/ui-extender';
import {useHistory} from 'react-router-dom';
import {PrimaryNavItem, Badge} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo';
import TaskIcon from '@jahia/moonstone/dist/icons/Task';
import Workflow from './Workflow';
import {NumberOfWorkflowsQuery} from './Workflow.gql-querys';
const PATH = '/workflow';

const POLL_INTERVAL = 10000; // 10 seconds

export const WorkflowGroup = () => {
    const {t} = useTranslation('jahia-user-entries');
    const history = useHistory();
    const {data} = useQuery(NumberOfWorkflowsQuery, {
        pollInterval: POLL_INTERVAL
    });

    const badge = data && data.jcr.activeWorkflowTaskCountForUser > 0 ? (
        <Badge
        type="round"
        color="danger"
        label={data.jcr.activeWorkflowTaskCountForUser}
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
    targets: ['nav-root-top'],
    path: PATH,
    defaultPath: PATH,
    requiredPermission: 'workflow-dashboard-access',
    render: () => <Workflow/>
});
