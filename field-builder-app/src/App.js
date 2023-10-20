import React, { useState } from "react";
import "./App.css";

function App() {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("Multi-select");
  const [isRequired, setIsRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState("Asia");
  const [choices, setChoices] = useState([]);
  const [order, setOrder] = useState("Display choices in Alphabetical");
  const [selectedLine, setSelectedLine] = useState(null);

  //处理排序
  
  const handleSort = (e) => {
    const selectedOrder = e.target.value;
    setOrder(selectedOrder);

    if (selectedOrder === "Display choices in Alphabetical") {
      setChoices(choices.sort((a, b) => a.value.localeCompare(b.value)));
    } else if (selectedOrder === "Display choices in Time") {
      setChoices(choices.sort((a, b) => a.time - b.time));
    }
    return choices;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      label: label,
      type: type,
      isRequired: isRequired,
      defaultValue: defaultValue,
      choices: choices,
      order: order,
    };
    console.log("Submitted Data:", formData);
    try {
      const response = await fetch(
        "http://www.mocky.io/v2/566061f21200008e3aabd919",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      console.log("API Response:", result);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handleFormReset = (e) => {
    e.preventDefault();
    setLabel("");
    setType("Multi-select");
    setIsRequired(false);
    setDefaultValue("");
    setChoices([]);
    setOrder("Display choices in Alphabetical");
    setSelectedLine(null);
  };

  return (
    <form className="field-builder" onSubmit={handleSubmit}>
      <h1>Field Builder</h1>

      <label>
        Label
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          required
        />
      </label>

      <label>
        Type
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Multi-select</option>
          <option>Single-select</option>
        </select>
        <input
          type="checkbox"
          checked={isRequired}
          onChange={() => setIsRequired(!isRequired)}
        />{" "}
        A value is required
      </label>

      <label>
        Default Value
        <input
          type="text"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const trimmedValue = defaultValue.trim();
              if (trimmedValue !== "") {
                if (!choices.map((each) => each.value).includes(trimmedValue)) {
                  setChoices((prevChoices) => [
                    ...prevChoices,
                    { value: trimmedValue, time: new Date() },
                  ]);
                  setDefaultValue("");
                } else {
                  alert("cannot add exiting choice");
                }
              }
            }
          }}
        />
      </label>

      <label>
        Choices
        <textarea
          value={choices.map((each) => each.value).join("\n")}
          rows={6}
          readOnly
          onClick={(e) => {
            const cursorPosition = e.target.selectionStart;
            const lines = e.target.value.substr(0, cursorPosition).split("\n");
            const lineNumber = lines.length - 1;
            setSelectedLine(lineNumber);
          }}
        />
      </label>
      <button
        type="button"
        onClick={() => {
          if (selectedLine !== null) {
            const newChoices = [...choices];
            newChoices.splice(selectedLine, 1);
            setChoices(newChoices);
            setSelectedLine(null);
          }
        }}
      >
        Delete Selected Choice
      </button>

      <br></br>
      <br></br>
      <label>
        Order
        <select value={order} onChange={handleSort}>
          <option>Display choices in Alphabetical</option>
          <option>Display choices in Time</option>
        </select>
      </label>

      <button type="submit">Save changes</button>
      <button type="button" onClick={handleFormReset}>
        Cancel
      </button>
    </form>
  );
}

export default App;
