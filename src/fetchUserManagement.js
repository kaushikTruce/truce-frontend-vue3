import { fetchAuthSession } from 'aws-amplify/auth';
import { getAPIBaseURL } from './utils';

// Build auth headers
export async function getAuthHeaders() {
    try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
            throw new Error('Failed to get id token');
        }

        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
        };
    } catch (error) {
        console.error('Error getting auth headers:', error);
        throw error;
    }
}

function normalizeStatus(status, enabled) {
    if (!status) return 'disabled';

    const s = status.toUpperCase();

    if (s === 'UNCONFIRMED' || s === 'FORCE_CHANGE_PASSWORD') {
        return 'pending';
    }

    return enabled ? 'enabled' : 'disabled';
}

// Fetch organization users
export async function getCompanyUsers() {
    const api_base_url = getAPIBaseURL();

    try {
        const response = await fetch(`${api_base_url}/organization/users`, {
            method: 'GET',
            headers: await getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data = await response.json();
        const users = data.records || [];

        return users.map((user) => ({
            id: user.user_id || user.email,
            username: user.name || user.email.split('@')[0],
            name: user.name,
            firstName: user.name ? user.name.split(' ')[0] : '',
            lastName: user.name
                ? user.name.split(' ').slice(1).join(' ')
                : '',
            email: user.email,
            phone_number: user.phone_number || '',
            user_status: normalizeStatus(user.status, user.enabled),
            user_create_date: user.created_at
                ? new Date(user.created_at)
                    .toISOString()
                    .split('T')[0]
                : '',
            enabled: user.enabled !== false,
            _emailVerified: user.email_verified
        }));
    } catch (error) {
        console.error('Error fetching company users:', error);
        throw error;
    }
}

export async function createCompanyUser(userData) {
    const api_base_url = getAPIBaseURL();

    try {
        const payload = {
            email: userData.email
        };

        const response = await fetch(`${api_base_url}/organization/users`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        const maybeJson = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message =
                maybeJson.message ||
                `Failed to create user: ${response.statusText}`;

            throw new Error(message);
        }

        const createdUserId = maybeJson.user_id || userData.email;
        const username = payload.email.split('@')[0];

        return {
            id: createdUserId,
            username,
            firstName: username,
            lastName: '',
            email: payload.email,
            phone_number: '',
            user_status: 'pending',
            user_create_date: new Date()
                .toISOString()
                .split('T')[0],
            enabled: true
        };
    } catch (error) {
        console.error('Error creating company user:', error);
        throw error;
    }
}

export async function toggleUserStatus(userId) {
    const api_base_url = getAPIBaseURL();

    try {
        const email = userId;

        if (!email || !email.includes('@')) {
            throw new Error(
                'A valid user email is required to toggle user status'
            );
        }

        const response = await fetch(
            `${api_base_url}/organization/users/${email}/toggle_access`,
            {
                method: 'POST',
                headers: await getAuthHeaders()
            }
        );

        const maybeJson = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message =
                maybeJson.message ||
                `Failed to toggle user status: ${response.statusText}`;

            throw new Error(message);
        }

        return {
            success: true,
            message:
                maybeJson.message ||
                'User status updated successfully',
            enabled: maybeJson.enabled
        };
    } catch (error) {
        console.error('Error toggling user status:', error);
        throw error;
    }
}

export async function resendInvitation(userId) {
    const api_base_url = getAPIBaseURL();

    try {
        const email = userId;

        if (!email || !email.includes('@')) {
            throw new Error(
                'A valid user email is required to resend confirmation'
            );
        }

        const response = await fetch(
            `${api_base_url}/organization/users/${email}/resend`,
            {
                method: 'POST',
                headers: await getAuthHeaders()
            }
        );

        const maybeJson = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message =
                maybeJson.message ||
                `Failed to resend confirmation: ${response.statusText}`;

            throw new Error(message);
        }

        return {
            success: true,
            message:
                maybeJson.message ||
                'Confirmation email resent successfully'
        };
    } catch (error) {
        console.error('Error resending invitation:', error);
        throw error;
    }
}
