import _ from "lodash";

import './index.css';

function component () {
  const element = document.createElement('div');

  let content = 'es6';
  let a = `Hello,${content}`;
  element.innerHTML = a;

  return element;
}

document.body.appendChild(component());