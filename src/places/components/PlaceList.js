import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';

import './PlaceList.css';
import Button from '../../shared/components/FormElements/Button';

const PlaceList = ({ places, onDeletePlace }) => {
  if (places.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to='/places/new'>Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className='place-list'>
      {places.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creatorId}
          coordinates={place.location}
          onDelete={onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
