import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import LabelInput from './components/LabelInput';
import TypeSelect from './components/TypeSelect';
import DefaultValueInput from './components/DefaultValueInput';
import ChoicesArea from './components/ChoicesArea';
import OrderSelect from './components/OrderSelect';

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
    //触发事件的元素（比如一个下拉菜单或输入框）的当前值
    const selectedOrder = e.target.value;
    setOrder(selectedOrder);

    //This line sorts the choices array based on the value property of each object, 
    //and then updates the state of choices to this newly sorted array using the setChoices function.
    //先按照字母顺序排序，再按照时间顺序排序
    //localeCompare() 方法返回一个数字来指示一个参考字符串是否在排序顺序前面或之后或与给定字符串相同。
    if (selectedOrder === "Display choices in Alphabetical") {
      setChoices(choices.sort((a, b) => a.value.localeCompare(b.value)));
    } else if (selectedOrder === "Display choices in Time") {
      setChoices(choices.sort((a, b) => a.time - b.time));
    }
    return choices;
  };

  //处理提交
  //The handleSubmit function is an asynchronous function that is triggered when the form is submitted.
  const handleSubmit = async (e) => { //async function。async函数返回一个promise对象
    e.preventDefault();//阻止默认事件，防止页面刷新
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
      const response = await axios.post(
        "http://www.mocky.io/v2/566061f21200008e3aabd919",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
    
  };

  //处理重置,清空表单
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
          //The onChange event handler is triggered when the value of the input field changes.
          onChange={(e) => setLabel(e.target.value)}
          //The onKeyDown event handler is triggered when a key is pressed.
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          required //required属性规定必需在提交之前填写输入字段
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
          //The checked attribute is a boolean attribute.
          checked={isRequired}
          onChange={() => setIsRequired(!isRequired)}
        />
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
              //The trim() method removes whitespace from both ends of a string.
              const trimmedValue = defaultValue.trim();
              if (trimmedValue !== "") {
                if (!choices.map((each) => each.value).includes(trimmedValue)) {
                  //The setChoices function is used to update the state of the choices array.
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
          //The onClick event handler is triggered when the user clicks on the textarea.
          onClick={(e) => {
            //，用户点了文本框里的哪个位置。比如，如果用户点了文本框的第5个字，那么这个数字就是5。
            const cursorPosition = e.target.selectionStart;
            //先找到用户点到哪里，然后取出从文本框最开始到这个点之间的所有文字。然后把这些文字按照行来分割成一个数组。
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
            //在 React 中，直接修改 state 是不推荐的，可能会导致页面不更新。所以，我们要用 setChoices 来修改 choices 的值。
            const newChoices = [...choices];//The spread operator is used to create a new array with the same elements as the choices array.
            newChoices.splice(selectedLine, 1);//The splice() method adds/removes items to/from an array, and returns the removed item(s).
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
