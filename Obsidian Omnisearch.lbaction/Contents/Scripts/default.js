// Fetch search results from Obsidian Omnisearch HTTP Server API 
// https://publish.obsidian.md/omnisearch/Public+API+%26+URL+Scheme#HTTP+Server+API

const OMNISEARCH_PORT = 51361;

function run(argument) {
  if (argument == null) {
    LaunchBar.alert("No argument was passed to the action");
  }
  // LaunchBar.debugLog(JSON.stringify(argument));

  const query = encodeURIComponent(argument);
  try {
    const result = HTTP.getJSON(`http://localhost:${OMNISEARCH_PORT}/search?q=${query}`);
    // LaunchBar.debugLog(JSON.stringify(result, null, 2));

    if (result == null) {
      throw new Error("HTTP.getJSON() returned undefined");
    }

    if (result.error != null) {
      throw new Error(`HTTP request error: ${result.error}`);
    }

    const items = result.data.map((item) => {
      const icon = 'md.obsidian';
      const title = item.basename;
      const vault = encodeURIComponent(item.vault);
      const file = encodeURIComponent(item.path);
      const url = `obsidian://open?vault=${vault}&file=${file}`;

      return {
        icon,
        title,
        url,
      }
    });

    // LaunchBar.debugLog(JSON.stringify(items));

    return items;
  } catch (exception) {
    LaunchBar.alert(`Error fetching results: ${exception} \n Is Obsidian w/ Omnisearch http server running on port ${OMNISEARCH_PORT}?`);
    LaunchBar.hide();
    return [];
  }
}