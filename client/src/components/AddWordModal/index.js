import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "react-loader-spinner";

import "./index.css";

const AddWordModal = (props) => {
  const {
    showModal,
    word,
    onNewWordInput,
    onCanelNewWord,
    onAddNewWord,
    apiStatus,
  } = props;

  return (
    <Modal
      dialogClassName="modal-width"
      show={showModal}
      onHide={() => onCanelNewWord()}
      backdrop="static"
      keyboard={true}
      centered
    >
      <Modal.Header dialogClassName="modal-header" closeButton>
        <Modal.Title dialogClassName="modal-title">
          Add to Dictionary
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6
          className={`modal-input-title ${
            apiStatus === "IN_PROGRESS" && "adding-word-title"
          }`}
        >
          New Word
        </h6>
        <input
          className={`modal-input ${
            apiStatus === "IN_PROGRESS" && "adding-word-input"
          }`}
          type="text"
          value={word}
          onChange={(event) => {
            onNewWordInput(event);
          }}
        />
      </Modal.Body>
      <Modal.Footer dialogClassName="modal-footer">
        <button
          variant="secondary"
          onClick={() => onCanelNewWord()}
          className="modal-cancel-button"
        >
          CANCEL
        </button>
        <button
          className="modal-add-button"
          variant="primary"
          onClick={() => onAddNewWord()}
        >
          {apiStatus === "IN_PROGRESS" ? (
            <Loader
              className="Loader"
              type="TailSpin"
              color="#63244a"
              height={30}
              width={30}
            />
          ) : (
            "ADD"
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddWordModal;
