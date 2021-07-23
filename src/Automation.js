import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tab, Tabs, TabList } from "react-tabs";
import DropzoneTab from "./DropzoneTab";
import { faChevronRight,
         faCog } from "@fortawesome/free-solid-svg-icons";
import saveAs from "file-saver";
import "./Custom.css";

function Automation() {
  //Set dict for file handling
  const [fileDict, setFileDict] = useState([
    {
      classname: "class_0",
      files: [],
    },
    {
      classname: "class_1",
      files: [],
    },
  ]);
  //Tab navigation
  const [tabId, setTabID] = useState(0);
  // handle input change
  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const list = [...fileDict];
    list[index].classname = value;
    setFileDict(list);
  };

  //ZIP file
  const zip = require("jszip")();
  const uploadZip = () => {
    fileDict.forEach((entry, index) => {
      zip.folder(entry.classname);
      entry.files.forEach((file) => {
        zip.folder(entry.classname).file(file.name, file);
      });
    });
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      const myFile = blobToFile(blob, "dataset.zip");
      upload(myFile);
    });
  };

  //Set blob type to file type
  const blobToFile = (theBlob, fileName) => {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  };

  //API status message
  const [buttonMessage, setButtonMessage] = useState("Train data");
  //upload API
  const upload = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://52.230.116.66:8000/uploadzip", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //Tracking API
  const fetchStatus = () => {
    fetch("http://52.230.116.66:8000/tracking")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.Status);
        if (data.Status === "Idle") {
          setButtonMessage("Train data");
        } else if (data.Status === "Ongoing") {
          setButtonMessage("Training...");
        } else if (data.Status === "Success") {
          setButtonMessage("Download");
        } else if (data.Status === "Failed") {
          setButtonMessage("Try again");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //Download API
  const downloadModel = () => {
    fetch("http://52.230.116.66:8000/requestfile")
      .then((res) => {
        if (res.ok) {
          return res.blob();
        } else {
          getFailedMessage();
          return Promise.reject();
        }
      })
      .then((blob) => saveAs(blob, "model.zip"))
      .catch((error) => {
        console.error(error);
      });
  };
  const getFailedMessage = () => {
    fetch("http://52.230.116.66:8000/failedmessage")
      .then((response) => response.json())
      .then((data) => {
        alert(data.Reason)
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //Set server interval
  useEffect(() => {
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  //BUTTONS!
  const [displayNext, setDisplayNext] = useState({ opacity: "0" });
  const [displayStatus, setDisplayStatus] = useState({
    opacity: "1",
    color: "#6b6a69",
  });
  const onMouseEnterhandlerNext = () => {
    setDisplayNext({ opacity: "1" });
    setDisplayStatus({ opacity: "0", color: "#6b6a69" });
  };
  const onMouseLeavehandlerNext = () => {
    setDisplayNext({ opacity: "0" });
    setDisplayStatus({ opacity: "1", color: "#6b6a69" });
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="main-box row">
        <Tabs className="react-tabs" onSelect={(index) => setTabID(index)}>
          <TabList className="d-flex">
            <Tab> {fileDict[0].classname} </Tab>
            <Tab> {fileDict[1].classname} </Tab>
          </TabList>
        </Tabs>
        <div
          style={{ display: tabId === 0 ? "block" : "none" }}
          className="px-5"
        >
          <div className="form-floating was-validated mt-4">
            <input
              type="text"
              name="class_0"
              className="form-control"
              placeholder="Create your label here..."
              onChange={(e) => {
                handleInputChange(e, 0);
              }}
              autoComplete="off"
              value={fileDict[0].classname}
              required
            />
            <label htmlFor="Class_0">Give a classname...</label>
          </div>
          <DropzoneTab
            files={fileDict[0].files}
            setFiles={(files) => {
              const list = [...fileDict];
              list[0].files = files;
              setFileDict(list);
            }}
          />
        </div>
        <div
          style={{ display: tabId === 1 ? "block" : "none" }}
          className="px-5"
        >
          <div className="form-floating was-validated mt-4">
            <input
              type="text"
              name="class_1"
              className="form-control"
              placeholder="Create your label here..."
              onChange={(e) => {
                handleInputChange(e, 1);
              }}
              autoComplete="off"
              value={fileDict[1].classname}
              required
            />
            <label htmlFor="Class_1">Give a classname...</label>
          </div>
          <DropzoneTab
            files={fileDict[1].files}
            setFiles={(files) => {
              const list = [...fileDict];
              list[1].files = files;
              setFileDict(list);
            }}
          />
        </div>

        <div className="d-flex justify-content-center">
          <button
            className="btn-tag-main mb-2 d-flex"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onMouseEnter={onMouseEnterhandlerNext}
            onMouseLeave={onMouseLeavehandlerNext}
            //Post something to APIs
            onClick={() => {
              if (buttonMessage === "Train data" || buttonMessage === "Try again") {
                uploadZip();
              } else if (buttonMessage === "Download") {
                downloadModel();
              }
            }}
            disabled={buttonMessage === "Training..." || fileDict[0].files.length <= 1 || fileDict[1].files.length <= 1}
          >
            <FontAwesomeIcon icon={faChevronRight} className="my-3" style={buttonMessage === "Training..." ? {display:"none"} : {display:"block"}} />
            <FontAwesomeIcon icon={faCog} className="my-3" spin style={buttonMessage === "Training..." ? {display:"block"} : {display:"none"}} />
          </button>
          <p className="lead btn-text me-4" style={displayNext}>
            {buttonMessage}
          </p>
          <p className="lead btn-status ms-4" style={displayStatus}>
            {buttonMessage}
          </p>
        </div>
        <i className="d-flex justify-content-center mb-3 status-log_err">
          {buttonMessage === "Try again" ? "err: An Error occurred." : ""}
        </i>
      </div>
    </div>
  );
}
export default Automation;
