import React, { useEffect, useState } from "react";
import Response from "./Response";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

const Prompt = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedEngines, setSelectedEngines] = useState("text-curie-001");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [supportedEngines, setSupportedEngines] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(searchText);
    setSearchText("");
  };

  useEffect(() => {
    loadResponses();
    loadSupportedEngines();
  }, []);

  const saveResponses = (responses) => {
    localStorage.setItem("responses", JSON.stringify(responses));
  };

  const loadResponses = () => {
    if (localStorage.getItem("responses")) {
      setResponses(JSON.parse(localStorage.getItem("responses")));
    }
  };

  function clearResponses() {
    saveResponses([]);
    setResponses([]);
  }

  const fetchData = async () => {
    try {
      const completion = await openai.createCompletion(selectedEngines, {
        prompt: searchText,
      });
      let temp = [...responses];
      temp.unshift({
        prompt: searchText,
        response: completion.data.choices[0].text,
        engine: selectedEngines,
      });
      setResponses(temp);
      saveResponses(temp);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert("Something Went Wrong!");
    }
  };

  const loadSupportedEngines = async () => {
    try {
      const supportedEngines = await openai.listEngines();

      setSupportedEngines(supportedEngines.data.data);
    } catch (error) {
      alert("Something Went Wrong!");
    }
  };
  const handleSelectEngine = (e) => {
    let { value } = e.target;
    setSelectedEngines(value);
  };

  return (
    <div>
      <div className="flex flex-col justify-center mt-20 w-full">
        <h1 className="text-center my-10 text-2xl">Shopify Challenge</h1>
        {supportedEngines.length === 0 ? (
          <div className="engine-loading-container"></div>
        ) : (
          <select
            className="bg-blue-800 rounded-full w-[400px] md:w-[700px] mx-auto p-2 text-white cursor-pointer  duration-400"
            name="engine"
            id="engine"
            onChange={handleSelectEngine}
          >
            {supportedEngines.map((engine) => (
              <option
                value={engine.id}
                selected={engine.id === "text-curie-001"}
              >
                {engine.id}
              </option>
            ))}
          </select>
        )}
        <form className="mx-auto my-10" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-5 ">
            <h1 className="font-bold">Enter Prompt Below:</h1>
            <textarea
              className="w-[400px] md:w-[700px] border-2 p-1 duration-400"
              placeholder="Your Message"
              rows={7}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="bg-blue-800 text-white p-4 rounded-full w-[250px] mx-auto cursor-pointer hover:bg-blue-500 duration-200"
              value="Submit"
            >
              Submit
            </button>
          </div>
        </form>
        {responses.length > 0 && !isLoading && (
          <div className="flex flex-col my-5 ">
            <h1 className="text-center text-bold">Responses</h1>
            <Response responses={responses} />
            <button
              type="submit"
              className="text-red-500 text-center cursor-pointer hover:text-red-800 duration-200"
              onClick={clearResponses}
            >
              Clear Response
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prompt;
