import React from 'react';

function prepare(assets) {
  const res = {
    styles: [],
    scripts: [],
  };

  Object
    .keys(assets)
    .reverse()
    .forEach((key) => {
      if (assets[key].css) {
        res.styles.push((
          <link
            key={key}
            rel="stylesheet"
            media="all"
            href={assets[key].css}
            charSet="UTF-8"
          />
        ));
      }

      if (assets[key].js) {
        res.scripts.push((<script key={key} src={assets[key].js} charSet="UTF-8" />));
      }
    });

  return res;
}

export default {
  prepare,
};
