import "./index.css";

const VocabItem = ({ eachWord, onClickWord }) => {
  const { _id, word, vocab_data } = eachWord;
  const renderData = vocab_data.slice(0, 2);
  return (
    <>
      <hr className="line" />
      <div onClick={() => onClickWord(_id)} className="container">
        <div>
          <h1 className="title">{word}</h1>
        </div>
        <div>
          {renderData.map((eachCat) => {
            return eachCat.lexicalEntries
              .slice(0, 2)
              .map((eachSubCat, index) => {
                return (
                  <div key={index}>
                    <p className="description">
                      <span>
                        ({eachSubCat.lexicalCategory.text.toLowerCase()}){" "}
                      </span>
                      {eachSubCat.entries[0].senses.map(
                        (eachSense) => eachSense.definitions
                      )}
                    </p>
                  </div>
                );
              });
          })}
        </div>
      </div>
    </>
  );
};

export default VocabItem;
