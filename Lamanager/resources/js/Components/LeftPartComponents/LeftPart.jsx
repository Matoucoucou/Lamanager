import React from "react";

export default function LeftPart({ ComposantProp, ...props }) {
  return (
    <div className="Left">
      {ComposantProp && <ComposantProp {...props} />}
    </div>
  );
}