import React, { useEffect, useReducer } from 'react';
import { validate } from '../../util/validators';

import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };

    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialIsValid || false,
    isTouched: false,
  });

  const changeHandler = (e) => {
    dispatch({
      type: 'CHANGE',
      val: e.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
      isTouched: true,
    });
  };

  // Handling input values back to NewPlace component
  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const elememt =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={inputState.value}
        onBlur={touchHandler}
        onChange={changeHandler}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onBlur={touchHandler}
        onChange={changeHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {elememt}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
