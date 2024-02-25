import React from 'react';
import './UserList.css';
import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';

const UserList = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No Users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className='users-list'>
      {users.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placesCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
