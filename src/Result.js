import React, { useState, useEffect } from "react";

const Result = (props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
  }, []);

  useEffect(() => {
    if (count) {
      // After data has loaded, call `next` to show next child (which is another Prompt)
      props.item.next();
    }
  }, [count]);

  return props.data ? (
    Array.isArray(props.data) ? (
      <>
        <style jsx>
          {`
            table {
              overflow: auto;
              border-spacing: 0;
              background-color: #000;
              padding: 10px;
              margin: 10px;
            }
            tr {
              border-top: 1px solid #c6cbd1;
            }
            th,
            td {
              padding: 6px 13px;
              border: 1px solid #dddddd;
            }
          `}
        </style>
        <table>
          <thead>
            <tr>
              <th>{props.header || "Table"}</th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((city, idx) => {
              return (
                <tr key={idx}>
                  <td>{city.area}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    ) : (
      JSON.stringify(props.data)
    )
  ) : (
    "No Data Found"
  );
};

export default Result;
