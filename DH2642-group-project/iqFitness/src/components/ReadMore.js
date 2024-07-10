import * as React from 'react';
import { useState } from 'react';

export default function ReadMore({ style = { margin: "0" }, length = 150, children }) {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  function intelligent_slice(text, l) {
    if (text.length <= l) return text;

    let base = text.slice(0, l);

    while (base.at(-1) !== " " && base.length > Math.max(l - 20, 0)) {
      base = base.slice(0, -1);
    }
    return base;
  }

  return (
    <span className="text" style={style}>
      {isReadMore ? intelligent_slice(text, length) : text}
      {text.length > length
        ?
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? " ...read more" : " show less"}
        </span>
        : <></>
      }
    </span>
  );
}