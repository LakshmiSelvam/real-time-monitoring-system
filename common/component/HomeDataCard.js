import "../Style/HomeDataCard.css";
import { useState, useEffect, useRef } from "react";
function HomeDataCard({ dataCards }) {
  // const parts = name.split(/(#\w+)/);

  const [data, setData] = useState([]);
  useEffect(() => {
    setData(dataCards);
  }, []);

  const dragCard = useRef(0);
  const draggedOverCard = useRef(0);
  function handleSort() {
    const cardClone = [...data];
    const temp = cardClone[dragCard.current];
    cardClone[dragCard.current] = cardClone[draggedOverCard.current];
    cardClone[draggedOverCard.current] = temp;
    setData(cardClone);
  }
  // const filter = (title) => {
  //   title.split(" ").map((word, i) =>
  //     word.startsWith("#")
  //       ? // <span key={i} style={{ fontWeight: "bold" }}>
  //         //   {console.log("eord", word)}
  //         // </span>
  //         console.log("word", word)
  //       : console.log("other", word)
  //   );
  // };
  // console.log("dataCards",dataCards.length);
  return (
    <>
      {dataCards?.map((data, index) => {
        return (
          <div
            className="data-card"
            key={index}
            draggable
            onDragStart={() => (dragCard.current = index)}
            onDragEnter={() => (draggedOverCard.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="data-info">
              {data.title.split(" ").map((word, i) => {
                return word.startsWith("#") ? (
                  <span className="data-title poppins-semibold">
                    {word.replace(/#/g, "").toUpperCase()}
                  </span>
                ) : (
                  <span className="data-subtitle poppins-regular">{word}</span>
                );
              })}
            </div>
            <div className="data-value poppins-bold">
              <span className="data-value-main  poppins-bold">
                {data.value || "0"}
              </span>
              <span className="data-value-unit  poppins-bold">
                {data.unit }
              </span>
            </div>
          </div>
        );
      })}
      {
        dataCards.length<=0 && (
          <div  className="data-card">
             <div className="data-info">
             <div className="data-info">
             <span className="data-subtitle poppins-regular">No Data Available  </span>
             </div>
             </div>
          </div>
        )
      }
    </>
  );
}

export default HomeDataCard;
