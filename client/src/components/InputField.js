import React from "react";

export default function InputField(props) {
  return (
    <div className="input-field col s12">
      <input
        id={props.label}
        type={props.type}
        className="validate"
        onChange={(e) => props.changer(e.target.value)}
      />
      <label htmlFor={props.label}>{props.label}</label>
    </div>
  );
}
