import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import StarRating from "./StarRating.jsx";
import "./index.css";
function Test() {
  const [rating, setRating] = useState(0);
  return (
    <div>
      <StarRating
        color="pink"
        size={56}
        messages={["Terrible", "Bad", "Okay", "Good", "Excellent"]}
        defaultRating={3}
        // onSetRating={setRating}
      />
      <p>{rating}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* <Test /> */}
  </React.StrictMode>
);
