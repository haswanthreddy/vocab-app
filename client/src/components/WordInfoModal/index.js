/* eslint-disable no-unused-vars */
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";

const WordInfoModal = (props) => {
  const { showModal, apiStatus, vocabData, isEmpty, onCloseWordInfoModal } =
    props;

  const renderModal = () => {
    if (apiStatus === "SUCCESS") {
      return (
        <Modal
          show={showModal}
          fullscreen={true}
          onHide={() => onCloseWordInfoModal()}
        >
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h1 className="word-info-title">{vocabData.word}</h1>
              <div>
                <p className="parts-of-speech">
                  {isEmpty
                    ? ""
                    : vocabData.vocab_data[0].lexicalEntries[0].lexicalCategory.text.toLowerCase()}
                </p>
                <p className="origin">
                  origin:{" "}
                  {isEmpty
                    ? ""
                    : vocabData.vocab_data[0].lexicalEntries[0].entries[0]
                        .etymologies[0]}
                </p>
              </div>
              <div className="discription-container">
                <p>
                  {
                    vocabData.vocab_data[0].lexicalEntries[0].entries[0]
                      .senses[0].definitions[0]
                  }
                </p>
                <ul>
                  <li>
                    {
                      vocabData.vocab_data[0].lexicalEntries[0].entries[0]
                        .senses[0].examples[0].text
                    }
                  </li>
                </ul>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      );
    } else if (apiStatus === "FAILURE") {
      return (
        <div>
          <h1>error fetching the data "DB error"</h1>
        </div>
      );
    }
  };

  return <>{renderModal()}</>;
};

export default WordInfoModal;
