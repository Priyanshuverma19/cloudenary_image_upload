'use client'

import { useEffect, useState } from 'react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);  // State to hold fetched users
    const [loading, setLoading] = useState(true);  // State to manage loading state
    const [error, setError] = useState(null);  // State to manage error state

    useEffect(() => {
        // Fetch users directly in the useEffect hook
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user'); // Adjust the path if necessary
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data); // Set the users data
                console.log(data);
            } catch (err) {
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();  // Call the fetchUsers function when the component mounts
    }, []);  // Empty dependency array ensures this runs only once when the component mounts

    // Loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Error state
    if (error) {
        return <div>{error}</div>;
    }

    // Display users
    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.length === 0 ? (
                    <li>No users found</li>
                ) : (
                    users.map(user => (
                        <li key={user._id}>
                            {user.name} - {user.email}
                            {/* You can display other user details here */}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
