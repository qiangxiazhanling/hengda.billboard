import React from 'react';

export default function BackwardButton() {
  return (
    <button type="button" className="btn btn-outline-secondary" onClick={() => window.history.go(-1)}>
      返回
    </button>
  );
}
