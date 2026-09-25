import axios from 'axios';

let activeController = null;

export async function callBackendProxy(prompt, token = '') {
  if (activeController) {
    activeController.abort();
  }

  activeController = new AbortController();

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios.post(
      '/api/ai/generate',
      { prompt },
      {
        headers,
        signal: activeController.signal,
        timeout: 30000
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
      throw { isCancelled: true, message: 'Request was cancelled by a newer prompt request.' };
    }
    if (error.response) {
      throw {
        status: error.response.status,
        error: error.response.data?.error || 'SERVER_ERROR',
        message: error.response.data?.message || 'Server returned an error response.'
      };
    }
    if (error.code === 'ECONNABORTED') {
      throw {
        error: 'TIMEOUT_ERROR',
        message: 'Request timed out after 30 seconds. The model response was too slow.'
      };
    }
    throw {
      error: 'NETWORK_ERROR',
      message: error.message || 'Failed to connect to backend server.'
    };
  }
}

export function cancelActiveRequest() {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }
}
