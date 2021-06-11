import React from "react";

export default function InputField(props) {
  return (
    <div class="input-field col s12">
      <input
        id={props.label}
        type={props.type}
        class="validate"
        onChange={(e) => props.changer(e.target.value)}
      />
      <label htmlFor={props.label}>{props.label}</label>
    </div>
  );
}
