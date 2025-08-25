// AddMember.js
import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const AddMember = ({ groupId }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/', {
                headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddMember = async () => {
        if (selectedUser) {
            try {
                await axios.post(`http://127.0.0.1:8000/massaging/groupss/${groupId}/add_member/`, { user_id: selectedUser.value }, {
                    headers: { Authorization: `Token ${localStorage.getItem("userTokenLG")}` }
                });
                alert('Member added successfully');
            } catch (error) {
                console.error('Error adding member:', error);
            }
        }
    };

    const userOptions = users.map(user => ({
        value: user.id,
        label: user.username,
    }));

    return (
        <div>
            <Select
                options={userOptions}
                onChange={setSelectedUser}
                placeholder="Select a user to add"
            />
            <button onClick={handleAddMember}>Add Member</button>
        </div>
    );
};

export default AddMember;

