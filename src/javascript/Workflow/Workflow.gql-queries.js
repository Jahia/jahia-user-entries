import gql from 'graphql-tag';

export const NumberOfWorkflowsSubscription = gql`
    subscription {
        workflowEvent {
            activeWorkflowTaskCountForUser
        }
    }
`;
