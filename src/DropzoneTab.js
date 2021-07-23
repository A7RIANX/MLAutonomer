import { React } from "react";
import { useDropzone } from "react-dropzone";

export default function DropzoneTab ({files, setFiles}) {
  
  const handleFileRemove = (index) => {
    const list = [...files];
    list.splice(index, 1);
    setFiles(list);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: "image/jpg, image/jpeg",
      multiple: "true",
      onDrop: (acceptedFiles) => {
        setFiles([
          ...files,
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ]);
      },
      noKeyboard: "true",
    });

  const images = files.map((file, index) => (
    <div key={file.name}>
      <div>
        <div
          className="preview-mask"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="rm-overlay d-flex align-items-center justify-content-center">
            <button
              type="button"
              className="btn-close btn-close-white rm-btn"
              onClick={() => {
                handleFileRemove(index);
              }}
              tabIndex="-1"
            ></button>
          </div>
          <img
            className="preview-img"
            src={file.preview}
            alt="preview_img"
            style={{ backgroundColor: "#555555aa" }}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div>
      <div
        {...getRootProps()}
        className="droparea container d-flex justify-content-center my-4"
      >
        <input {...getInputProps()} required />
        <div className="align-self-center">
          <div hidden={files.length >= 1} className="lead">
            <i style={{ userSelect: "none" }}>
              {!isDragActive &&
                "Drop .jpg images for proceed the Automation process, minimum image file must exceed to 10 files, otherwise the operation will not be executed."}
              {isDragActive && !isDragReject && "Drop Images Here."}
              {isDragReject &&
                "Error: File type not supported, accepted only .jpg files only."}
            </i>
          </div>
        </div>
        <div className="droparea-img">{images}</div>
      </div>
    </div>
  );
}
