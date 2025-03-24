import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Strong, Lozenge, Stack, Inline, Spinner } from '@forge/react';
import { invoke } from '@forge/bridge';

const ValidationRow = ({ status, label }) => (
  <Inline alignBlock="baseline" space="space.100">
      <Lozenge appearance={status? "success" : "removed"}>{status? "YES" : "NO"}</Lozenge>
      <Text>{label}</Text>
  </Inline>
);

const App = () => {
  const [issueData, setIssueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
         const data = await invoke('getIssueData');
         setIssueData(data);
         console.log("getting issue data");
         console.log(issueData)
      } catch(err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner/>;
  if (error) return <Text>Error: {error}</Text>

  const hasValidAssignee = issueData.fields.assignee && 
                          issueData.fields.assignee.accountId !== issueData.fields.reporter?.accountId;

  const hasDescription = issueData.fields.description?.content?.length > 0;
 
  return (
    <>
      <Stack alignInline="start">
        <Text><Strong>Issue Validator</Strong></Text>
        <ValidationRow
          status={hasValidAssignee}
          label="Valid Assignee (different from reporter)?"
        />
        <ValidationRow
          status={hasDescription}
          label="Description provided?"
        />
      </Stack>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
