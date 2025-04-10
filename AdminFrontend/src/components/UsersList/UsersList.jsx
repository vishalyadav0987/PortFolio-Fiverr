import React from 'react';
import './UsersList.css';
import { useUserContext } from '../../Context/UserContext';
import useFetchAllUser from '../../CustomHook/useFetchAllUser';

const dummyUsers = [
    { id: 1, name: 'Vishal Kumar', email: 'vishal@example.com', joined: '2025-01-12' },
    { id: 2, name: 'Amit Singh', email: 'amit@example.com', joined: '2025-02-15' },
    { id: 3, name: 'Pooja Sharma', email: 'pooja@example.com', joined: '2025-03-01' },
];

const UsersList = () => {
    const { allRegisteredUser, loading } = useUserContext();
    useFetchAllUser()
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };



    return (
        <div className="users-list-container">
            <header className="gigs-header">
                <h1>Registered Users <span>Management</span></h1>
            </header>
            <div className="users-list-table-container">
                <table className="users-list-table">
                    <thead className="users-list-table-header">
                        <tr>
                            <th className="users-list-header-cell users-list-serial">#</th>
                            <th className="users-list-header-cell users-list-name">Name</th>
                            <th className="users-list-header-cell users-list-email">Email</th>
                            <th className="users-list-header-cell users-list-email">Authorized</th>
                            <th className="users-list-header-cell users-list-joined">Last Login</th>
                            <th className="users-list-header-cell users-list-joined">Join Date</th>
                        </tr>
                    </thead>
                    <tbody className="users-list-table-body">
                        {allRegisteredUser && allRegisteredUser?.map((user, index) => (
                            <tr key={user._id} className="users-list-row">
                                <td className="users-list-cell users-list-serial">{index + 1}</td>
                                <td className="users-list-cell users-list-name">
                                    <div className="users-list-user-info">
                                        <img
                                            src={user?.avatar.url}
                                            alt={user?.name}
                                            className='users-list-avatar' />
                                        {user?.name}
                                    </div>
                                </td>
                                <td className="users-list-cell users-list-email">{user?.email}</td>
                                <td className="users-list-cell users-list-email" style={{
                                    minWidth:"150px"
                                }}>
                                    <span className='plan-badge'>
                                        {user?.isVerified ? 'Verified' : "Un-Authorized"}
                                    </span>

                                </td>
                                <td className="users-list-cell users-list-joined">
                                    {formatDate(user?.lastLogin)}
                                </td>
                                <td className="users-list-cell users-list-joined">
                                    {formatDate(user?.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersList;