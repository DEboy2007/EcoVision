import React from 'react';
import '../styles/main.css';
import { useState } from 'react';

const api_key = import.meta.env.VITE_OPENAI_KEY;


const Main = () => {

    const [prompt, setPrompt] = useState("Plastic Water Bottle, Smartphone, Headphones, BMW Car");
    const [answer, setAnswer] = useState("No answer yet...");
    const [image, setImage] = useState(null);

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
                    "messages": [{ "role": "assistant", "content": "I have the following items next to me, what can I do with these items to limit their harm to the environment, and what substitutes can I get for these items that are less harmful to the environment? Also mention how to properly dispose of the object, if applicable. Make the list for each item look nice and indent properly. The items are: " + prompt }]
                })
            }).then(response => {
                return response.json();
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

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    }

    const formRef = React.createRef();

    return (
        <div className="container">
            <div className='header'>
                <h1>EcoVision</h1>
                <h2>Repurpose and Reuse</h2>
            </div>
            <br /><br />
            <form ref={formRef} onSubmit={handleButtonClick}>
                <div className="file">
                    <span>Upload your image</span>
                    <button type="button"></button>
                    <input type="file" id="img" name="img" accept="image/*" onChange={handleImageChange} />
                </div>
                <br />
                <p>{image ? "Uploaded image: " : null}</p>
                {image && (
                    <img
                        className="uploaded-image"
                        src={URL.createObjectURL(image)}
                        alt="Uploaded"
                    />
                )}
                <br />
                <textarea className="textarea1" value={prompt} readOnly onChange={handleTextboxChange} />
                <textarea className="textarea2" value={answer} readOnly />
                <br />
                <input type="submit" value="Scan Image" />
            </form>
            <br /><br />
            <div className="About">
                <h1>About this project</h1>
                <br />
                <h2>How this works:</h2>
                <p>Users can upload images to the website of an area at home such as their desk or kitchen counter, but also a public area such as a local park. Our advanced object detection model will identify various things in the image that can potentially be harmful to the environment and will display a list of identified items. Then, we use OpenAI's gpt-3.5-turbo model for Natural Language Processing. This is used to suggest substitutes for the harmful item, more sustainable ways to use it, and cool tricks to utilize the item to its maximum extent!</p>
                <br />
                <h2>Inspiration: </h2>
                <p>Several million tons of waste make their way into the landfill every single year. Currently, there are 50-75 trillion pieces of plastic in the ocean! Most people do not think about the items they own and their sustainable alternatives often, as it takes too much time and motivation to individually research greener substitutes for each one of their household products. We aim to fix this problem by giving users easy-to-act-upon and realistic tips to use their current items more sustainably, and recommendations for greener alternatives as well. Best of all, they only need to take a single image for all this excellent information!</p>
                <br />
                <h2>How we built it</h2>
                <p>We used YOLOv5 for our object recognition model, which is trained on a dataset containing thousands of images of litter, trash, and items that are otherwise harmful to the environment. For our NLP Model, we used OpenAI's gpt-3.5-turbo to analyze the items detected in the image and provide better alternatives and advice. For our front end, we used ReactJS bundled with Vite.</p>
                <br />
            </div>
        </div>
    )
}

export default Main;