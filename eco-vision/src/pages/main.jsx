import React from 'react';
import '../styles/main.css';
import { useState } from 'react';

const Main = () => {
    const api_key = import.meta.env.VITE_OPENAI_KEY;

    const [prompt, setPrompt] = useState("Plastic Water Bottle, Smartphone, Headphones, BMW Car");
    const [answer, setAnswer] = useState("No answer yet...");

    async function handleGPTRequest() {
        console.log("Calling OpenAI API");
        try {
            await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + api_key
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": [{ "role": "assistant", "content": "I have the following items next to me, what can I do with these items to limit their harm to the environment, and what substitutes can I get for these items that are less harmful to the environment? Make the list for each item look nice and indent properly. The items are: " + prompt }]
                })
            }).then(response => {
                return response.json(import.meta.env.REACT_APP_OPENAI_KEY);
            }).then(data => {
                console.log(data);
                setAnswer(data["choices"][0]["message"].content);
            });
        } catch (error) {
            console.log(error);
            setAnswer("Unfortunately, the API encountered an error. We apologize for the inconvenience, please try again!")
        }
    }

    const handleTextboxChange = (event) => {
        setPrompt(event.target.value);
    }

    const handleButtonClick = (event) => {
        event.preventDefault();
        setAnswer("Loading...");
        handleGPTRequest();
    }

    const formRef = React.createRef();

    return (
        <div className="container">
            <div className='header'>
                <h1>EcoVision</h1>
                <h2>Repurpose and Substitute</h2>
            </div>
            <br /><br />
            <form ref={formRef} onSubmit={handleButtonClick}>
                <div className="file">
                    <span>Upload your image</span>
                    <button type="button"></button>
                    <input type="file" id="img" name="img" accept="image/*" />
                </div>
                <br />
                <textarea className="textarea1" value={prompt} readOnly onChange={handleTextboxChange} />
                <textarea className="textarea2" value={answer} readOnly />
                <br />
                <input type="submit" value="Scan Image" />
            </form>
        </div>
    )
}

export default Main;