/* eslint-disable no-unused-vars */
import { Component } from "react";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Loader from "react-loader-spinner";

import VocabItem from "../VocabItem";
import AddWordModal from "../AddWordModal";
import WordInfoModal from "../WordInfoModal";
import "./index.css";

/*writing the main component Home here as class because there is more data that need to maintained in state, would be easy and make less clutter
then React Hooks,*/

class Home extends Component {
  state = {
    vocabData: [], // te data that need to displayed in home page
    apiStatus: "INITIAL", // and its apistatus just keep track
    showModal: false, // initial value of modal is kept false as it needs to displayed only when clicked
    singleVocabData: [], // data for a specified word when clicked on it
    singleApiStatus: "INITIAL", // and its api status
    search: "", // the search term, by deafault its "" so that everything is fetched from data base
    showSearch: false, // initially only icon is displayed if someone clicks on the icon then search is displayed
    showAddModal: false, //initial value of add button at right bottom corner , as it needs to be view only when clicked so initial value is false
    newWord: "", // the new word added with add button feature at right bottom corner
    newWordApiStatus: "INITIAL", // and its api status
  };

  // api call is made in compnentDidMout lifecycle method so that after render method renders the element the requiered data is fetched
  // and only data that needs to updated will re-render , and in this case while rendering loader would be displayed
  componentDidMount() {
    this.setState({ apiStatus: "IN_PROGRESS" }, this.getAllData);
  }

  onApiGetAllSuccess = (data) => {
    this.setState({ apiStatus: "SUCCESS", vocabData: data });
  };

  onApiGetAllFailure = () => {
    this.setState({ apiStatus: "FAILURE" });
  };

  // for getting all the data
  getAllData = async (search = "") => {
    const data = await fetch(`http://localhost:5000/?search=${search}`);
    const result = await data.json();
    if (result.status === "success") {
      this.onApiGetAllSuccess(result.data);
    } else {
      this.onApiGetAllFailure();
    }
  };

  onApiGetSuccess = (data) => {
    this.setState({
      singleVocabData: data,
      singleApiStatus: "SUCCESS",
      showModal: true,
    });
  };

  onApiGetFailure = () => {
    this.setState({ showModal: false, singleApiStatus: "FAILURE" });
  };

  // for getting  data of single word when that particular word is clicked
  getSingleData = async (id) => {
    console.log(id, "workign");
    const options = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const response = await fetch(`http://localhost:5000/${id}`, options);
    const data = await response.json();
    console.log(data);
    if (data.status === "success") {
      this.onApiGetSuccess(data.data);
      console.log("success");
    } else {
      this.onApiGetAllFailure();
    }
  };

  // search bar funtionality , when searched the search term is set as query parameter to the url in get all api call
  onSearchInput = (event) => {
    if (event.target.value === "" && event.target.value === "") {
      this.setState({ search: "" });
      this.getAllData("");
      return;
    }
    this.setState({ search: event.target.value }, () => {
      this.getAllData(event.target.value);
    });
  };

  // on click search button is displayed
  onClickSearch = (event) => {
    this.setState((prevState) => ({
      showSearch: !prevState.showSearch,
      search: "",
      vocabData: [...prevState.vocabData],
    }));
  };

  // this function add words in db the word is kept in body of request configuration and with post method we add word in db
  addWordInDB = async (word) => {
    try {
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      };
      const response = await fetch("http://localhost:5000/", options);
      const data = await response.json();

      if (data.status === "success") {
        this.setState((prevState) => ({
          newWordApiStatus: "SUCESS",
          newWord: "",
          vocabData: [...prevState.vocabData, data.data],
        }));
      } else {
        this.setState({ newWordApiStatus: "FAILURE" });
        alert(data.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // when add button is clicked onClickAdd is called ---> modal is displayed ---> the word added in input is changed by newWordInput function from there
  // after in put below funtion is called
  onAddNewWord = () => {
    const { newWord, newWordApiStatus } = this.state;
    this.setState({ newWordApiStatus: "IN_PROGRESS" });
    this.addWordInDB(newWord);
  };

  // add button to show modal in right side bottom corner
  onClickAdd = (event) => {
    this.setState({ showAddModal: true });
  };

  // the new word in added in modal input is chaged here accessing it through event object passed by onChange event
  onNewWordInput = (event) => {
    this.setState({ newWord: event.target.value });
  };

  // handle close
  // handle cancel ---- when either close or cancel button is clicked the modal to add word is closed
  onCanelNewWord = () => {
    this.setState({ showAddModal: false, newWord: "" });
  };

  // modal to add word is kept in separate function to improve readbility
  renderAddModal = () => {
    const { showAddModal, newWord, newWordApiStatus } = this.state;

    return (
      <AddWordModal
        showModal={showAddModal}
        word={newWord}
        apiStatus={newWordApiStatus}
        onAddNewWord={this.onAddNewWord}
        onNewWordInput={this.onNewWordInput}
        onCanelNewWord={this.onCanelNewWord}
      />
    );
  };

  // modal to add word is kept in separate function to improve readbility
  renderWordInfoModal = () => {
    const { showModal, singleVocabData, singleApiStatus } = this.state;
    const isEmpty = singleVocabData.length === 0;
    return (
      <WordInfoModal
        showModal={showModal}
        vocabData={singleVocabData}
        apiStatus={singleApiStatus}
        isEmpty={isEmpty}
        onCloseWordInfoModal={this.onCloseWordInfoModal}
      />
    );
  };

  // the word info modal is modal opened when clicked on a word ,
  // when clicked on its closed button the show modal is changed to false to not display it
  onCloseWordInfoModal = () => {
    this.setState({
      showModal: false,
      singleVocabData: [],
      singleApiStatus: "INITIAL",
    });
  };

  // onClick mondal with id , when clicked on a specific word the api to fetch single data is called
  onClickWord = (id) => {
    this.setState(
      {
        singleApiStatus: "IN_PROGRESS",
      },
      () => {
        this.getSingleData(id);
      }
    );
  };

  // after data is fetched the success view is rendered or other wise loading view is rendered
  renderSuccessView = () => {
    const { vocabData, showSearch, search } = this.state;

    return (
      <>
        {this.renderWordInfoModal()}
        <div className="header">
          {!showSearch && <h1>Vocab</h1>}
          {showSearch && (
            <input
              type="text"
              value={search}
              placeholder="search"
              onChange={this.onSearchInput}
            />
          )}
          <button type="button" onClick={this.onClickSearch}>
            {showSearch ? <CloseIcon /> : <SearchIcon />}
          </button>
        </div>
        <div className="main-container">
          <div className="vocab-container">
            <div className="words-list-container">
              <h1>Words List</h1>
            </div>

            <div className="content-container">
              {vocabData.map((eachWord) => {
                return (
                  <VocabItem
                    eachWord={eachWord}
                    key={eachWord._id}
                    onClickWord={this.onClickWord}
                  />
                );
              })}
              <div>{this.renderAddModal()}</div>

              <button
                className="add-button"
                type="button"
                onClick={this.onClickAdd}
              >
                <AddIcon />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#63244a" height={80} width={80} />
    </div>
  );

  render() {
    // eslint-disable-next-line no-unused-vars
    const { vocabData, apiStatus, showSearch, search } = this.state;
    console.log(apiStatus);

    return (
      <>
        {apiStatus === "IN_PROGRESS"
          ? this.renderLoadingView()
          : this.renderSuccessView()}
      </>
    );
  }
}

export default Home;
