import React from 'react';

export default function Error(): JSX.Element {
  return (
    <div className="container text-center">
      <div className="col-md-8 ml-auto mr-auto">
        <h2 className="display-2">404</h2>
        <h4 className="display-3">That's an error.</h4>
        <h5 className="display-4">
          The site configured at this address does not contain the requested
          file.
        </h5>
      </div>
    </div>
  );
}
