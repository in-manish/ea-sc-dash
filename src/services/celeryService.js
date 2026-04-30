import { getApiUrl } from '../config';

const getHeaders = (token) => {
    const baseUrl = getApiUrl();
    const origin = new URL(baseUrl).origin;

    return {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        'Authorization': `Token ${token}`,
        'Connection': 'keep-alive',
        'Origin': origin,
        'Referer': `${origin}/`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    };
};

export const celeryService = {
    async getCeleryBeatTasks(token) {
        try {
            const response = await fetch(`${getApiUrl()}/celery-beat/tasks/`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Celery Beat Tasks Error:', error);
            throw error;
        }
    },

    async updateTaskStatus(token, taskName, enabled) {
        try {
            const response = await fetch(`${getApiUrl()}/celery-beat/tasks/status/`, {
                method: 'PATCH',
                headers: {
                    ...getHeaders(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task_name: taskName,
                    enabled: enabled
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update Celery Task Status Error:', error);
            throw error;
        }
    },

    async updateTask(token, taskId, taskData) {
        try {
            const response = await fetch(`${getApiUrl()}/celery-beat/tasks/${taskId}/`, {
                method: 'PATCH',
                headers: {
                    ...getHeaders(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update Celery Task Error:', error);
            throw error;
        }
    }
};
