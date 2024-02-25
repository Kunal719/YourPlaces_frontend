import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const PlaceItem = ({
  id,
  image,
  title,
  description,
  address,
  creatorId,
  coordinates,
  onDelete,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMap = () => {
    setShowMap(true);
  };

  const closeMap = () => {
    setShowMap(false);
  };

  const openDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const closeDeleteWarningHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      onDelete(id);
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMap}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMap}>CLOSE MAP</Button>}
      >
        <div className='map-container'>
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={closeDeleteWarningHandler}
        header='Are you sure?'
        footerClass='place-item__modal_actions'
        footer={
          <>
            <Button inverse onClick={closeDeleteWarningHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to delete this place? This action can't be undone
          afterwards.
        </p>
      </Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
              alt={title}
            />
          </div>
          <div className='place-item__info'>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMap}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && auth.userId === creatorId && (
              <Button to={`/places/${id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && auth.userId === creatorId && (
              <Button danger onClick={openDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
