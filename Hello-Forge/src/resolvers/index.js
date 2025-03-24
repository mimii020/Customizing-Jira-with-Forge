import Resolver from '@forge/resolver';
import api, { route } from '@forge/api'

const resolver = new Resolver();

resolver.define('getIssueData', async (req) => {
  try {
    const issueKey = req.context.extension.issue.key;
    const response = await api.asApp().requestJira(
      route`/rest/api/2/issue/${issueKey}` , {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching issue:', error);
    throw error;
  }
});

export const handler = resolver.getDefinitions();
