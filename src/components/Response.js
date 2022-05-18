import React from "react";

const Response = ({ responses }) => {
  return (
    <>

      {responses.map((response, index) => (
        <div key={index}>
          <div className="flex flex-col justify-center w-fulls items-center">
            <div className="flex flex-col w-[400px] md:w-[700px] space-y-5 bg-blue-200 p-3 rounded-lg my-3">
              <div className="flex">
                <div className="font-bold">Prompt:</div>
                <p className="pl-10">{response.prompt}</p>
              </div>
              <div className="flex">
                <div className="font-bold">Response:</div>
                <p className="pl-5">{response.response}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Response;
