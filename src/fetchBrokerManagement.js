import { getAuthHeaders } from './fetchUserManagement';
import { getAPIBaseURL } from './utils';


export async function getCompanyBrokers() {
    const api_base_url = getAPIBaseURL()
    try {
        const response = await fetch(`${api_base_url}/organization/brokers`, {
            method: 'GET',
            headers: await getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch brokers: ${response.statusText}`)
        }

        const data = await response.json()
        const brokers = data.records || [];

        return brokers.map(broker => ({
            id: broker.brokerId,
            brokerName: broker.brokerName,
            originalStatus: broker.status,
            _remarks: broker._remarks
        }))

    } catch (error) {
        console.error('Error fetching Broker users:', error);
        throw error;
    }
}

export async function toggleBrokerStatus(brokerId, enable, remarks) {
    const api_base_url = getAPIBaseURL()
    try {
        const response = await fetch(
            `${api_base_url}/organization/brokers/${brokerId}`,
            {
                method: 'PUT',
                headers: await getAuthHeaders(),
                body: JSON.stringify({
                    enable: enable,
                    remarks: remarks || ''
                })
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to toggle broker status: ${response.statusText}`)
        }

        return await response.json();
    }
    catch (error) {
        console.error('Error toggling broker status:', error)
        throw error;
    }

}
