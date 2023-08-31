import React from 'react';
import {registry} from '@jahia/ui-extender';
import {useHistory} from 'react-router-dom';
import {Badge, PrimaryNavItem} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {useSubscription} from '@apollo/react-hooks';
import TaskIcon from '@jahia/moonstone/dist/icons/Task';
import Workflow from './Workflow';
import {NumberOfWorkflowsSubscription} from './Workflow.gql-queries';
import {shallowEqual, useSelector} from 'react-redux';

export default function () {
    const PATH = '/workflow';

    const WorkflowItem = props => {
        const {t} = useTranslation('jahia-user-entries');
        const history = useHistory();
        const {pathname} = useSelector(state => ({
            pathname: state.router.location.pathname
        }), shallowEqual);
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
                {...props}
                badge={badge}
                isSelected={pathname.startsWith(PATH)}
                icon={<TaskIcon/>}
                label={t('userEntries.workflow.label')}
                onClick={() => history.push(PATH)}/>
        );
    };

    registry.add('primary-nav-item', 'workflow', {
        targets: ['nav-root-tasks:2'],
        requiredPermission: 'workflow-dashboard-access',
        render: () => <WorkflowItem key="workflowGroup"/>
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
