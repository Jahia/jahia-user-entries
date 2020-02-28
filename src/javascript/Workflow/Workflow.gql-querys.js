import gql from 'graphql-tag';

const NumberOfWorkflowsQuery = gql`
    query NumberOfWorkflowsQuery {
        jcr {
            activeWorkflowTaskCountForUser
        }
    }
`;

export {NumberOfWorkflowsQuery};
