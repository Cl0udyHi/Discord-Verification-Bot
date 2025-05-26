const transientErrors = ["ETIMEDOUT", "ECONNRESET"];

async function fetchWithRetries(url: string, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    const result = await fetchData(url);
    if (result.success) return result;

    if (
      result.error &&
      !transientErrors.includes(result.error.code ?? "") &&
      !(result.status && result.status >= 500)
    ) {
      return result;
    }

    if (i < retries) {
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }

  return {
    success: false,
    error: "Failed after retries",
  };
}

export default async function fetchData(url: string): Promise<any> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Fetch failed [${response.status}]: ${url}`);

      return {
        success: false,
        error: `HTTP ${response.status}`,
        status: response.status,
      };
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    console.error(`Fetch exception for ${url}:`, error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export { fetchWithRetries };
