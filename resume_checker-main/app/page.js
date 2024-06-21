"use client"
import React, { useState } from "react";
import "./page.css"

const SUMARIZE_URL = "/api";

export default function Home() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [desc,setDesc]=useState("");
  const [file, setFile] = useState(null);

  function sendToAPI(text){
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
      })
    }).then((response) => {
        return response.json();
      }).then((data) => {
        setSummary(data.summary);
        console.log("response", data)
      });
  }
  const summarizeText = (text) => {
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setSummary(data.message.content);
      });
  };


  const onLoadFile = function () {
    const typedarray = new Uint8Array(this.result);

    // Load the PDF file.
    pdfjsLib.getDocument({ data: typedarray }).promise.then((pdf) => {
      console.log("PDF loaded");

      // Fetch the first page
      pdf.getPage(1).then((page) => {
        console.log("Page loaded");

        // Get text from the page
        page.getTextContent().then((textContent) => {
          let text = "";
          textContent.items.forEach((item) => {
            text += item.str + " ";
          });
          // Display text content
          // document.getElementById("pdfContent").innerText = text;
          // setIsLoading(true);
          // summarizeText(text);
          sendToAPI(text);

        });
      });
    });
  };
  
  const onChangeFileInput = (event) => {
    const file = event.target.files[0];
    if (file.type !== "application/pdf") {
      console.error(file.name, "is not a PDF file.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = onLoadFile;

    fileReader.readAsArrayBuffer(file);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (!file) {
      console.error("No file selected.");
      return;
    }

    onLoadFile(file);
  };


  return (
    <>
    <div className="container">
    <h1>Resume Checker 😎</h1>
    <form onSubmit={handleSubmit}>
      <textarea id="jobdescription" placeholder="job description" onChange={(e)=>setDesc(e.target.value)}></textarea>
      <br /><br />
      <label htmlFor="file">Upload Resume:</label>
      <input 
        type="file"
        id="file"
        name="file"
        accept=".pdf"
        onChange={onChangeFileInput}
      />
      <br /><br />
      <button type="submit">Check Ats</button>
      <button type="submit">Check Score</button>
      <button type="submit">How it works</button>
    </form>
    
    <p>{summary}</p>
    </div>
  </>

  );
}

