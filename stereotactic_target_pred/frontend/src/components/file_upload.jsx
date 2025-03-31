import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload = () => {
  const [selectedModel, setSelectedModel] = useState(""); 
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".fcsv",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedModel) {
      alert("Please select a file and a model type!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_type", selectedModel);
    console.log("file", {file}, "model_type", {selectedModel})

    try {
      const response = await axios.post("http://127.0.0.1:5000/apply-model", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`Success: ${response.data.message}`);
      setSuccess(true);
    } catch (error) {
      alert("Upload failed!");
      console.error(error);
      setSuccess(false);
    }
  };

  const handleDownload = async () => {
    const response = await axios.get("http://127.0.0.1:5000/download-output", {
      responseType: "blob", // Important for file downloads
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "output.zip");
    document.body.appendChild(link);
    link.click();
  }
  
  return (
    <div className="container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop an .fcsv file here, or click to select</p>
        )}
      </div>
      <select onChange={(e) => setSelectedModel(e.target.value)}>
        <option value="">Select Model</option>
        <option value="model_1">STN</option>
        <option value="model_2">cZI</option>
      </select>
      {file && <p>Selected File: {file.name}</p>}
      <button onClick={handleSubmit}>Upload</button>
      {success && (
        <button onClick={handleDownload}>Download Output</button>
      )}
    </div>
  );
};

export default FileUpload;
